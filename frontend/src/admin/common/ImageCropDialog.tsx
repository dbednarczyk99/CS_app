import { useState } from 'react';
import Cropper, { type Area } from 'react-easy-crop';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slider,
  Stack,
  Typography,
  useMediaQuery,
  type Theme,
} from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { cropImage, ratioLabel, type ImagePreset } from './image-presets';

/**
 * Kadrowanie wybranego zdjęcia przed wgraniem: stałe proporcje (jak na stronie), kontrola minimalnego
 * rozmiaru i zmniejszenie do maksymalnego. Zwraca gotowy plik JPEG.
 */
export function ImageCropDialog({
  file,
  preset,
  onDone,
  onCancel,
}: {
  file: File;
  preset: ImagePreset;
  onDone: (file: File) => void;
  onCancel: () => void;
}) {
  const fullScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const [src] = useState(() => URL.createObjectURL(file));
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  const [broken, setBroken] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);
  const [busy, setBusy] = useState(false);

  const aspect = preset.aspect ?? (size ? size.width / size.height : 1);
  // największy możliwy kadr w tych proporcjach (przy powiększeniu 1)
  const fullWidth = size ? Math.min(size.width, size.height * aspect) : 0;
  const fullHeight = fullWidth / aspect;
  const tooSmall = !!size && (Math.floor(fullWidth) < preset.minWidth || Math.floor(fullHeight) < preset.minHeight);
  // powiększenie ograniczone tak, żeby kadr nie zszedł poniżej minimum
  const maxZoom = size && !tooSmall ? Math.max(1, Math.min(fullWidth / preset.minWidth, fullHeight / preset.minHeight)) : 1;

  // rozmiar wyniku: kadr zmniejszony do maksimum; przy stałych proporcjach liczony z proporcji (bez błędów zaokrągleń)
  const outWidth = area ? Math.round(Math.min(area.width, preset.maxWidth, preset.maxHeight * aspect)) : 0;
  const output = area
    ? {
        width: outWidth,
        height: preset.aspect
          ? Math.round(outWidth / aspect)
          : Math.round(area.height * Math.min(1, preset.maxWidth / area.width, preset.maxHeight / area.height)),
      }
    : null;

  const close = (result?: File) => {
    URL.revokeObjectURL(src);
    if (result) onDone(result);
    else onCancel();
  };

  const save = async () => {
    if (!area || !output) return;
    setBusy(true);
    try {
      close(await cropImage(src, area, output.width, output.height, file.name));
    } catch {
      setBroken(true);
      setBusy(false);
    }
  };

  return (
    <Dialog open fullScreen={fullScreen} maxWidth="md" fullWidth onClose={() => !busy && close()}>
      <DialogTitle>{preset.aspect ? `Kadr zdjęcia (${ratioLabel(preset.aspect)})` : 'Zdjęcie'}</DialogTitle>
      <DialogContent>
        {broken ? (
          <Alert severity="error">
            Nie udało się otworzyć tego pliku. Zapisz zdjęcie jako JPG albo PNG i spróbuj jeszcze raz.
          </Alert>
        ) : (
          <>
            <Box sx={{ position: 'relative', height: { xs: '55vh', sm: 420 }, bgcolor: '#111' }}>
              <Cropper
                image={src}
                crop={crop}
                zoom={zoom}
                maxZoom={maxZoom}
                aspect={aspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, pixels) => setArea(pixels)}
                onMediaLoaded={(media) => setSize({ width: media.naturalWidth, height: media.naturalHeight })}
                objectFit="contain"
                mediaProps={{ onError: () => setBroken(true) }}
              />
            </Box>
            {preset.aspect && !tooSmall && (
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2 }}>
                <ZoomInIcon color="action" />
                <Slider
                  value={zoom}
                  min={1}
                  max={maxZoom}
                  step={0.01}
                  onChange={(_, v) => setZoom(v as number)}
                  disabled={maxZoom <= 1}
                  aria-label="Powiększenie"
                />
              </Stack>
            )}
            {tooSmall && size ? (
              <Alert severity="error" sx={{ mt: 2 }}>
                Zdjęcie jest za małe ({size.width} × {size.height} px) – na stronie byłoby nieostre. Potrzeba kadru co
                najmniej {preset.minWidth} × {preset.minHeight} px. Wybierz zdjęcie w większej rozdzielczości (np. prosto
                z aparatu lub telefonu, nie z komunikatora).
              </Alert>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                {preset.aspect
                  ? 'Przesuń zdjęcie i ustaw powiększenie tak, żeby w ramce było to, co ma być widać na stronie.'
                  : 'Zdjęcie zostanie wgrane w całości.'}
                {size && output && (
                  <>
                    {' '}
                    Oryginał {size.width} × {size.height} px → wynik <strong>{output.width} × {output.height} px</strong>{' '}
                    (JPEG).
                  </>
                )}
              </Typography>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => close()} disabled={busy}>
          Anuluj
        </Button>
        <Button variant="contained" onClick={save} disabled={busy || broken || tooSmall || !area}>
          {busy ? 'Przygotowywanie…' : preset.aspect ? 'Przytnij i wgraj' : 'Wgraj'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
