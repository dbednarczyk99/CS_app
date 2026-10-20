import { useEffect, useState } from 'react';
import { Title, useNotify } from 'react-admin';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControlLabel,
  IconButton,
  Link,
  Paper,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { apiUrl, httpClient } from '../../dataProvider';
import { ImageUploadField } from '../common/ImageUploadField';
import { VersionHistory } from './VersionHistory';
import { fetchRevisions } from './revisions';
import { SeoPreview } from './SeoPreview';

const webUrl = import.meta.env.VITE_WEB_URL || 'http://localhost:3001';

// opis pól z serwera (backend/src/modules/content/sections.ts)
type Field =
  | {
      name: string;
      label: string;
      type: 'text' | 'textarea';
      max: number;
      /** zalecana długość (np. w Google) – po przekroczeniu ostrzeżenie */
      recommended?: number;
      required?: boolean;
      help?: string;
      rows?: number;
    }
  | { name: string; label: string; type: 'image'; help?: string; required?: boolean; aspect?: string }
  | { name: string; label: string; type: 'toggle'; help?: string }
  | { name: string; label: string; type: 'list'; help?: string; min: number; max: number; itemLabel: string; fields: Field[] };

type Values = Record<string, unknown>;
type Image = { url: string; alt: string };

interface Section {
  key: string;
  title: string;
  description?: string;
  /** sekcja SEO – podgląd w Google i na Facebooku */
  seo?: { path: string; suffix: boolean };
  fields: Field[];
  defaults: Values;
  value: Values;
  customized: boolean;
  updatedAt: string | null;
}

/** Pusta wartość pola – dla nowej pozycji listy */
const emptyValue = (field: Field): unknown =>
  field.type === 'toggle'
    ? false
    : field.type === 'image'
      ? { url: '', alt: '' }
      : field.type === 'list'
        ? []
        : '';

const emptyItem = (fields: Field[]) => Object.fromEntries(fields.map((f) => [f.name, emptyValue(f)]));

/** Jedno pole formularza (lista – rekurencyjnie, z dodawaniem, usuwaniem i kolejnością) */
function FieldInput({
  field,
  value,
  onChange,
  fallbackImage,
}: {
  field: Field;
  value: unknown;
  onChange: (v: unknown) => void;
  /** zdjęcie pokazywane, gdy pole zdjęcia jest puste (np. domyślne zdjęcie do udostępniania) */
  fallbackImage?: { url: string; note: string };
}) {
  switch (field.type) {
    case 'text':
    case 'textarea': {
      const text = typeof value === 'string' ? value : '';
      const over = text.length > field.max;
      const overRecommended = !over && field.recommended !== undefined && text.length > field.recommended;
      return (
        <TextField
          label={field.label + (field.required ? ' *' : '')}
          value={text}
          onChange={(e) => onChange(e.target.value)}
          fullWidth
          multiline={field.type === 'textarea'}
          minRows={field.type === 'textarea' ? (field.rows ?? 3) : undefined}
          error={over || (!!field.required && !text.trim())}
          helperText={
            <Box component="span" sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
              <span>{field.help ?? ''}</span>
              <Box component="span" sx={{ whiteSpace: 'nowrap', color: overRecommended ? 'warning.main' : undefined }}>
                {field.recommended !== undefined
                  ? `${text.length} znaków${overRecommended ? ` – Google pokaże ok. ${field.recommended}` : ` (zalecane do ${field.recommended})`}`
                  : `${text.length} / ${field.max}`}
              </Box>
            </Box>
          }
          sx={{ mb: 2 }}
          variant="filled"
          size="small"
        />
      );
    }
    case 'toggle':
      return (
        <Box sx={{ mb: 1.5 }}>
          <FormControlLabel
            control={<Switch checked={value === true} onChange={(e) => onChange(e.target.checked)} />}
            label={field.label}
          />
          {field.help && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: 6 }}>
              {field.help}
            </Typography>
          )}
        </Box>
      );
    case 'image': {
      const image = (value && typeof value === 'object' ? value : { url: '', alt: '' }) as Image;
      return (
        <Box sx={{ mb: 1 }}>
          <ImageUploadField
            label={field.label + (field.required ? ' *' : '')}
            value={image.url || null}
            onChange={(url) => onChange({ ...image, url: url ?? '' })}
            help={field.help}
            aspect={field.aspect}
            removable={!field.required}
            fallbackUrl={fallbackImage?.url}
            fallbackNote={fallbackImage?.note}
          />
          <TextField
            label="Opis zdjęcia (dla niewidomych i Google)"
            value={image.alt}
            onChange={(e) => onChange({ ...image, alt: e.target.value })}
            fullWidth
            size="small"
            variant="filled"
            helperText={`Krótko, co widać na zdjęciu; puste – zdjęcie ozdobne · ${image.alt.length} / 160`}
            error={image.alt.length > 160}
            sx={{ mb: 2 }}
          />
        </Box>
      );
    }
    case 'list': {
      const items = (Array.isArray(value) ? value : []) as Values[];
      const set = (next: Values[]) => onChange(next);
      const move = (from: number, to: number) => {
        const next = [...items];
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        set(next);
      };
      return (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            {field.label}{' '}
            <Typography component="span" variant="caption" color="text.secondary">
              ({items.length}
              {field.min === field.max ? '' : `, od ${field.min} do ${field.max}`})
            </Typography>
          </Typography>
          {field.help && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              {field.help}
            </Typography>
          )}
          <Stack spacing={1.5}>
            {items.map((item, i) => (
              <Paper key={i} variant="outlined" sx={{ p: 2 }}>
                <Stack direction="row" alignItems="center" sx={{ mb: 1.5 }}>
                  <Typography variant="overline" color="primary" sx={{ flex: 1 }}>
                    {field.itemLabel} {i + 1}
                  </Typography>
                  {field.min !== field.max && (
                    <>
                      <Tooltip title="Wyżej">
                        <span>
                          <IconButton size="small" disabled={i === 0} onClick={() => move(i, i - 1)}>
                            <ArrowUpwardIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="Niżej">
                        <span>
                          <IconButton size="small" disabled={i === items.length - 1} onClick={() => move(i, i + 1)}>
                            <ArrowDownwardIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="Usuń">
                        <span>
                          <IconButton
                            size="small"
                            color="error"
                            disabled={items.length <= field.min}
                            onClick={() => set(items.filter((_, j) => j !== i))}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </>
                  )}
                </Stack>
                {field.fields.map((sub) => (
                  <FieldInput
                    key={sub.name}
                    field={sub}
                    value={item[sub.name]}
                    onChange={(v) => set(items.map((it, j) => (j === i ? { ...it, [sub.name]: v } : it)))}
                  />
                ))}
              </Paper>
            ))}
          </Stack>
          {items.length < field.max && field.min !== field.max && (
            <Button startIcon={<AddIcon />} sx={{ mt: 1.5 }} onClick={() => set([...items, emptyItem(field.fields)])}>
              Dodaj: {field.itemLabel.toLowerCase()}
            </Button>
          )}
        </Box>
      );
    }
  }
}

/** Krótki opis wersji sekcji na liście historii: pierwszy niepusty tekst (np. tytuł) */
const summarize = (data: Values) => {
  for (const v of Object.values(data)) if (typeof v === 'string' && v.trim()) return v.length > 70 ? `${v.slice(0, 67)}…` : v;
  const list = Object.values(data).find(Array.isArray) as unknown[] | undefined;
  return list ? `${list.length} poz.` : '';
};

/** Jedna sekcja strony: formularz, zapis, wcześniejsze wersje, stan domyślny */
function SectionEditor({
  section,
  onSaved,
  defaultShareImage,
}: {
  section: Section;
  onSaved: (s: Section) => void;
  /** domyślne zdjęcie podglądu linku (Elementy wspólne) – dla sekcji SEO bez własnego */
  defaultShareImage?: string;
}) {
  const notify = useNotify();
  const [value, setValue] = useState<Values>(section.value);
  const [errors, setErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  // wczytana do formularza wcześniejsza wersja albo stan domyślny (jeszcze niezapisane)
  const [loaded, setLoaded] = useState<string | null>(null);
  const dirty = JSON.stringify(value) !== JSON.stringify(section.value);
  const isDefault = JSON.stringify(value) === JSON.stringify(section.defaults);

  const load = (data: Values, label: string) => {
    setValue(data);
    setLoaded(label);
    setErrors([]);
  };

  const save = async () => {
    setSaving(true);
    setErrors([]);
    try {
      const { json } = await httpClient(`${apiUrl}/content/${section.key}`, {
        method: 'PUT',
        body: JSON.stringify(value),
      });
      onSaved({ ...section, value: json as Values, customized: true, updatedAt: new Date().toISOString() });
      setValue(json as Values);
      setLoaded(null);
      notify('Zapisano – zmiana pojawi się na stronie za kilka sekund', { type: 'success' });
    } catch (error) {
      const message = (error as { body?: { message?: string | string[] } }).body?.message;
      setErrors(Array.isArray(message) ? message : [message ?? 'Nie udało się zapisać sekcji']);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Accordion disableGutters variant="outlined" sx={{ '&:before': { display: 'none' } }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1, pr: 1 }} flexWrap="wrap" useFlexGap>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {section.title}
          </Typography>
          {dirty && <Chip size="small" color="warning" label="niezapisane zmiany" />}
          {!dirty && section.customized && !isDefault && <Chip size="small" variant="outlined" label="zmienione" />}
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{ maxWidth: 820 }}>
        {section.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {section.description}
          </Typography>
        )}
        {loaded && dirty && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Wczytano {loaded}. Sprawdź treść i kliknij „Zapisz sekcję”, aby ją przywrócić na stronie – albo „Cofnij zmiany”.
          </Alert>
        )}
        {section.seo && (
          <SeoPreview
            title={String(value.title ?? '')}
            description={String(value.description ?? '')}
            imageUrl={(value.image as Image | undefined)?.url || defaultShareImage || ''}
            path={section.seo.path}
            suffix={section.seo.suffix}
          />
        )}
        {section.fields.map((field) => (
          <FieldInput
            key={field.name}
            field={field}
            value={value[field.name]}
            onChange={(v) => setValue((prev) => ({ ...prev, [field.name]: v }))}
            fallbackImage={
              section.seo && field.type === 'image' && defaultShareImage
                ? { url: defaultShareImage, note: 'Domyślne zdjęcie (Strona → Podstrony → Elementy wspólne) – tak jest teraz.' }
                : undefined
            }
          />
        ))}
        {errors.length > 0 && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.map((e) => (
              <div key={e}>{e}</div>
            ))}
          </Alert>
        )}
        <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap>
          <Button variant="contained" onClick={save} disabled={!dirty || saving}>
            {saving ? 'Zapisywanie…' : 'Zapisz sekcję'}
          </Button>
          {dirty && (
            <Button
              onClick={() => {
                setValue(section.value);
                setLoaded(null);
              }}
              disabled={saving}
            >
              Cofnij zmiany
            </Button>
          )}
          <VersionHistory
            revisions={() => fetchRevisions(`${apiUrl}/content/${section.key}/revisions`)}
            load={load}
            summary={summarize}
          />
          <Button
            color="inherit"
            startIcon={<RestartAltIcon />}
            disabled={isDefault}
            onClick={() => load(section.defaults, 'stan domyślny (teksty i zdjęcia z dnia uruchomienia strony)')}
          >
            Przywróć stan domyślny
          </Button>
          {section.updatedAt && (
            <Typography variant="caption" color="text.secondary">
              Zmieniono {new Date(section.updatedAt).toLocaleString('pl-PL')}
            </Typography>
          )}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}

/**
 * Ekran edycji treści jednej strony (np. strony głównej): sekcje w kolejności jak na stronie, każda z własnym
 * zapisem. Formularze budowane z opisu pól z serwera – nowa sekcja nie wymaga zmian w panelu.
 */
export function ContentEditor({
  page,
  title,
  intro,
  path,
  embedded = false,
}: {
  page: string;
  title: string;
  intro: string;
  /** adres strony do podglądu, np. „/” */
  path: string;
  /** wewnątrz innego ekranu (np. zakładka „Podstrony”) – bez własnego tytułu w pasku */
  embedded?: boolean;
}) {
  const [sections, setSections] = useState<Section[] | null | undefined>(undefined);
  // domyślne zdjęcie podglądu linku – do podglądu sekcji SEO bez własnego zdjęcia
  const [defaultShareImage, setDefaultShareImage] = useState<string>();

  useEffect(() => {
    httpClient(`${apiUrl}/content`)
      .then(({ json }) => setDefaultShareImage((json as Record<string, { image?: Image }>)['seo.default']?.image?.url))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    let cancelled = false;
    httpClient(`${apiUrl}/content/sections?page=${page}`)
      .then(({ json }) => !cancelled && setSections(json as Section[]))
      .catch(() => !cancelled && setSections(null));
    return () => {
      cancelled = true;
    };
  }, [page]);

  return (
    // minWidth 0: w kolumnie flex (np. pod zakładkami) edytor nie rośnie do szerokości najdłuższego tekstu
    <Box sx={{ width: '100%', maxWidth: 1000, minWidth: 0, mx: 'auto', py: embedded ? 2 : { xs: 2, md: 4 } }}>
      {!embedded && <Title title={title} />}
      <Stack direction="row" alignItems="flex-end" justifyContent="space-between" flexWrap="wrap" gap={2} sx={{ mb: 1 }}>
        <Typography variant="h5">{title}</Typography>
        <Link href={`${webUrl}${path}`} target="_blank" rel="noreferrer" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
          Zobacz na stronie <OpenInNewIcon fontSize="inherit" />
        </Link>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {intro}
      </Typography>
      {sections === undefined && <CircularProgress size={28} />}
      {sections === null && <Alert severity="error">Nie udało się wczytać treści – odśwież stronę.</Alert>}
      {sections && (
        <Stack spacing={1.5}>
          {sections.map((section) => (
            <SectionEditor
              key={section.key}
              section={section}
              defaultShareImage={section.key === 'seo.default' ? undefined : defaultShareImage}
              onSaved={(next) => {
                setSections((all) => all?.map((s) => (s.key === next.key ? next : s)) ?? null);
                if (next.key === 'seo.default') setDefaultShareImage((next.value.image as Image | undefined)?.url);
              }}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
}
