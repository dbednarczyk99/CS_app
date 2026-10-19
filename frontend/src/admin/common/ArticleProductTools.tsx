import { useMemo, useState } from 'react';
import { useGetList, useNotify } from 'react-admin';
import { useFormContext, useWatch } from 'react-hook-form';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { apiUrl, httpClient } from '../../dataProvider';

type ProductOption = {
  id: string;
  name: string;
  isActive: boolean;
  promoActive?: boolean;
  isSeasonal?: boolean;
  inSeason?: boolean;
  availableFrom?: string | null;
  unavailableFrom?: string | null;
  isPromo?: boolean;
  promoFrom?: string | null;
  promoTo?: string | null;
};

const warsawDay = (time: number) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Warsaw' }).format(new Date(time));
const dayMonth = (day: string) => new Date(`${day}T12:00:00`).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long' });
const when = (iso: string) =>
  new Date(iso).toLocaleString('pl-PL', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });

/**
 * Ostrzeżenia dla kafelków na chwilę publikacji wpisu (teraz albo zaplanowana): produkt jeszcze niewidoczny
 * lub poza sezonem (z uwzględnieniem zaplanowanych zmian dostępności), promocja jeszcze się nie zaczęła albo
 * już skończyła – żeby wpis nie zapowiadał czegoś, czego w e-mailu i na stronie nie będzie.
 */
function tileWarnings(products: ProductOption[], at: number) {
  const day = warsawDay(at);
  const warnings: string[] = [];
  for (const p of products) {
    let active = p.isActive;
    let inSeason = p.inSeason !== false;
    // zaplanowane zmiany do chwili publikacji, w kolejności
    const events = [
      p.availableFrom && { at: new Date(p.availableFrom).getTime(), on: true },
      p.unavailableFrom && { at: new Date(p.unavailableFrom).getTime(), on: false },
    ]
      .filter((e): e is { at: number; on: boolean } => !!e && e.at <= at)
      .sort((a, b) => a.at - b.at);
    for (const e of events) {
      if (e.on) {
        active = true;
        inSeason = true;
      } else if (p.isSeasonal) inSeason = false;
      else active = false;
    }
    const later = p.availableFrom && new Date(p.availableFrom).getTime() > at ? ` (pojawi się ${when(p.availableFrom)})` : '';
    if (!active) {
      warnings.push(`„${p.name}” nie będzie jeszcze widoczny na stronie${later} – kafelek się nie pokaże.`);
      continue;
    }
    if (p.isSeasonal && !inSeason)
      warnings.push(`„${p.name}” będzie poza sezonem${later} – kafelek pokaże „Wróci w sezonie”, bez ceny.`);
    if (p.isPromo && p.promoFrom && p.promoFrom > day)
      warnings.push(`Promocja na „${p.name}” zaczyna się dopiero ${dayMonth(p.promoFrom)} – w chwili publikacji będzie cena regularna.`);
    if (p.isPromo && p.promoTo && p.promoTo < day)
      warnings.push(`Promocja na „${p.name}” skończy się ${dayMonth(p.promoTo)}, przed publikacją wpisu.`);
  }
  return warnings;
}

// akapit „[produkt:<id> Nazwa]” – strona i newsletter zamieniają go na kafelek produktu (nazwa dla czytelności)
const TOKEN = /\[produkt:([0-9a-f-]{36})[^\]]*\]/gi;
const token = (p: ProductOption) => `[produkt:${p.id} ${p.name}]`;

/**
 * Narzędzia pod treścią wpisu: wstawienie kafelka produktu (w miejscu kursora, jako osobny akapit),
 * „Wstaw aktualne promocje”, lista produktów w treści i podgląd e-maila newslettera (bez zapisu i wysyłki).
 */
export const ArticleProductTools = () => {
  const { setValue, getValues } = useFormContext();
  const content = (useWatch({ name: 'content' }) as string | undefined) ?? '';
  const publishAt = useWatch({ name: 'publishAt' }) as string | null | undefined;
  const [now] = useState(() => Date.now());
  const notify = useNotify();
  const { data: products = [] } = useGetList<ProductOption>('products', {
    pagination: { page: 1, perPage: 500 },
    sort: { field: 'name', order: 'ASC' },
  });
  const [picked, setPicked] = useState<ProductOption | null>(null);
  const [preview, setPreview] = useState<{ subject: string; html: string } | null>(null);

  const inContent = useMemo(() => {
    const ids = [...new Set([...content.matchAll(TOKEN)].map((m) => m[1].toLowerCase()))];
    return ids.map((id) => products.find((p) => p.id.toLowerCase() === id) ?? { id, name: '(usunięty produkt)', isActive: false });
  }, [content, products]);

  /** Wstawia akapity w miejscu kursora w polu „Treść” (albo na końcu) */
  const insert = (blocks: string[]) => {
    const current: string = getValues('content') ?? '';
    const field = document.getElementById('content') as HTMLTextAreaElement | null;
    const at = field && document.activeElement === field ? field.selectionStart : current.length;
    const before = current.slice(0, at).replace(/\s+$/, '');
    const after = current.slice(at).replace(/^\s+/, '');
    const next = [before, ...blocks, after].filter(Boolean).join('\n\n');
    setValue('content', next, { shouldDirty: true, shouldValidate: true });
  };

  const promoProducts = products.filter((p) => p.isActive && p.promoActive);
  // chwila publikacji: zaplanowana albo teraz
  const publishTime = publishAt && new Date(publishAt).getTime() > now ? new Date(publishAt).getTime() : now;
  const warnings = tileWarnings(
    inContent.filter((p): p is ProductOption => 'availableFrom' in p || p.isActive),
    publishTime,
  );

  const showPreview = async () => {
    const values = getValues();
    try {
      const { json } = await httpClient(`${apiUrl}/newsletter/preview`, {
        method: 'POST',
        body: JSON.stringify({
          id: values.id,
          title: values.title || 'Tytuł wpisu',
          shortDescription: values.shortDescription || '',
          content: values.content || '',
          isPublished: values.isPublished !== false,
          imageUrl: values.images?.[0]?.imgUrl ?? values.images?.[0]?.src ?? null,
        }),
      });
      setPreview(json as { subject: string; html: string });
    } catch {
      notify('Nie udało się przygotować podglądu', { type: 'error' });
    }
  };

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems={{ md: 'center' }}>
        <Autocomplete
          size="small"
          sx={{ minWidth: 260, flex: 1, maxWidth: 420 }}
          // także produkty zaplanowane na później (zapowiedź nowości) – ostrzeżenie poniżej powie, czy zdążą
          options={products.filter((p) => p.isActive || p.availableFrom)}
          getOptionLabel={(p) =>
            p.isActive ? p.name : `${p.name} (pojawi się ${p.availableFrom ? when(p.availableFrom) : 'później'})`
          }
          value={picked}
          onChange={(_, value) => setPicked(value)}
          renderInput={(params) => <TextField {...params} label="Produkt do wstawienia" />}
        />
        <Button
          variant="outlined"
          startIcon={<AddShoppingCartIcon />}
          disabled={!picked}
          onClick={() => {
            if (picked) insert([token(picked)]);
            setPicked(null);
          }}
        >
          Wstaw kafelek
        </Button>
        <Button
          variant="outlined"
          startIcon={<LocalOfferIcon />}
          disabled={promoProducts.length === 0}
          onClick={() => insert(promoProducts.map(token))}
          title={promoProducts.length === 0 ? 'Teraz nie trwa żadna promocja' : undefined}
        >
          Wstaw aktualne promocje ({promoProducts.length})
        </Button>
        <Button startIcon={<VisibilityIcon />} onClick={showPreview}>
          Podgląd e-maila
        </Button>
      </Stack>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
        Kafelek pojawia się w treści jako osobny akapit „[produkt: …]” – na stronie i w newsletterze zamienia się w
        kartę produktu ze zdjęciem, ceną i linkiem. Kafelek możesz przesunąć albo usunąć jak zwykły tekst.
      </Typography>
      {inContent.length > 0 && (
        <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap" sx={{ mt: 1 }} alignItems="center">
          <Typography variant="caption" color="text.secondary">
            Produkty w treści:
          </Typography>
          {inContent.map((p) => (
            <Chip
              key={p.id}
              size="small"
              label={p.isActive ? p.name : `${p.name} – niewidoczny na stronie`}
              color={p.isActive ? 'default' : 'warning'}
            />
          ))}
        </Stack>
      )}

      {warnings.length > 0 && (
        <Alert severity="warning" sx={{ mt: 1.5 }}>
          <strong>
            {publishTime > now ? `Na chwilę publikacji (${when(new Date(publishTime).toISOString())}):` : 'Uwaga do kafelków:'}
          </strong>
          {warnings.map((w) => (
            <div key={w}>• {w}</div>
          ))}
        </Alert>
      )}

      <Dialog open={preview !== null} onClose={() => setPreview(null)} maxWidth="md" fullWidth>
        <DialogTitle>Podgląd newslettera: {preview?.subject}</DialogTitle>
        <DialogContent sx={{ p: 0, bgcolor: '#141618' }}>
          {preview && (
            <iframe
              title="Podgląd e-maila"
              srcDoc={preview.html}
              style={{ width: '100%', height: '70vh', border: 0, display: 'block' }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Typography variant="caption" color="text.secondary" sx={{ mr: 'auto', pl: 1 }}>
            Tak zobaczą wpis subskrybenci (ceny z dnia dzisiejszego). Podgląd niczego nie wysyła.
          </Typography>
          <Button onClick={() => setPreview(null)}>Zamknij</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
