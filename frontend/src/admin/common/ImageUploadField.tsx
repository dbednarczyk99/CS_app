import { useRef, useState } from 'react';
import { useNotify } from 'react-admin';
import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { uploadFile } from '../../dataProvider';

const webUrl = import.meta.env.VITE_WEB_URL || 'http://localhost:3001';

/** Podgląd: zdjęcia wbudowane w stronę (/images/…) leżą na stronie, wgrane – na serwerze API (pełny adres) */
const previewUrl = (url: string) => (url.startsWith('/') ? `${webUrl}${url}` : url);

/**
 * Pole zdjęcia: podgląd, „Wybierz zdjęcie” / „Zmień” (plik wgrywa się od razu na serwer) i opcjonalnie „Usuń”.
 * Zwraca adres zdjęcia. Stare wgrane zdjęcie serwer usuwa sam po zapisaniu formularza.
 */
export function ImageUploadField({
  label,
  value,
  onChange,
  help,
  removable = false,
  aspect = '4 / 3',
  fallbackUrl,
  fallbackNote,
}: {
  label: string;
  value: string | null | undefined;
  onChange: (url: string | null) => void;
  help?: string;
  removable?: boolean;
  /** proporcje podglądu (jak na stronie), np. „4 / 5” */
  aspect?: string;
  /** zdjęcie pokazywane na stronie, gdy pole jest puste (np. zdjęcie produktu sezonowego) */
  fallbackUrl?: string | null;
  /** wyjaśnienie pod podglądem zdjęcia zastępczego */
  fallbackNote?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const notify = useNotify();

  const pick = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      notify('Wybierz plik ze zdjęciem (JPG, PNG, WebP)', { type: 'warning' });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      notify('Zdjęcie jest za duże – najwyżej 10 MB', { type: 'warning' });
      return;
    }
    setUploading(true);
    try {
      onChange(await uploadFile(file));
    } catch {
      notify('Nie udało się wgrać zdjęcia', { type: 'error' });
    } finally {
      setUploading(false);
      if (input.current) input.current.value = '';
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.75 }}>
        {label}
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'flex-start' }}>
        <Box
          sx={{
            width: 180,
            aspectRatio: aspect,
            bgcolor: 'action.hover',
            border: 1,
            borderColor: 'divider',
            overflow: 'hidden',
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
          }}
        >
          {uploading ? (
            <CircularProgress size={24} />
          ) : value ? (
            <img src={previewUrl(value)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : fallbackUrl ? (
            // pole puste, ale strona pokazuje zdjęcie automatyczne – podgląd tego, co faktycznie widać
            <img src={previewUrl(fallbackUrl)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
          ) : (
            <Typography variant="caption" color="text.secondary">
              brak zdjęcia
            </Typography>
          )}
        </Box>
        <Stack spacing={1} alignItems="flex-start">
          <input
            ref={input}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => void pick(e.target.files?.[0])}
          />
          <Button
            variant="outlined"
            size="small"
            startIcon={<PhotoCameraIcon />}
            disabled={uploading}
            onClick={() => input.current?.click()}
          >
            {value ? 'Zmień zdjęcie' : 'Wybierz zdjęcie'}
          </Button>
          {removable && value && (
            <Button size="small" color="error" startIcon={<DeleteOutlineIcon />} onClick={() => onChange(null)}>
              Usuń
            </Button>
          )}
          {!value && fallbackUrl && fallbackNote && (
            <Typography variant="caption" color="info.main" sx={{ maxWidth: 360 }}>
              {fallbackNote}
            </Typography>
          )}
          {help && (
            <Typography variant="caption" color="text.secondary" sx={{ maxWidth: 360 }}>
              {help}
            </Typography>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
