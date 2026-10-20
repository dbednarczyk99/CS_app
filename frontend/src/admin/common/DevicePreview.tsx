import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Box, Stack, ToggleButton, ToggleButtonGroup, Typography, useMediaQuery, type Theme } from '@mui/material';
import ComputerIcon from '@mui/icons-material/Computer';
import SmartphoneIcon from '@mui/icons-material/Smartphone';

export type PreviewDevice = 'desktop' | 'phone';

/** Szerokości, w których rysujemy podgląd – jak strona na komputerze i na typowym telefonie */
const WIDTH: Record<PreviewDevice, number> = { desktop: 1280, phone: 390 };

/**
 * Podgląd z przełącznikiem „Komputer | Telefon” (na komputerze i na telefonie). Treść rysowana jest w prawdziwej
 * szerokości urządzenia i – gdy się nie mieści – zmniejszana do szerokości miejsca w panelu, więc układ jest
 * taki jak u klienta. Domyślnie – urządzenie, na którym otwarto panel.
 */
export function DevicePreview({
  title = 'Podgląd na stronie',
  children,
  widths = WIDTH,
}: {
  title?: string;
  /** treść podglądu dla wybranego urządzenia */
  children: (device: PreviewDevice) => ReactNode;
  /** szerokości urządzeń (np. e-mail na komputerze – okno poczty ok. 800 px) */
  widths?: Record<PreviewDevice, number>;
}) {
  const small = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'), { noSsr: true });
  const [device, setDevice] = useState<PreviewDevice>(small ? 'phone' : 'desktop');
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [available, setAvailable] = useState(0);
  const [height, setHeight] = useState(0);

  // dostępna szerokość i wysokość treści – do skalowania
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      setAvailable(outer.current?.clientWidth ?? 0);
      setHeight(inner.current?.offsetHeight ?? 0);
    });
    if (outer.current) observer.observe(outer.current);
    if (inner.current) observer.observe(inner.current);
    return () => observer.disconnect();
  }, []);

  const width = widths[device];
  const scale = available ? Math.min(1, available / width) : 1;
  const phone = device === 'phone';

  return (
    <Box sx={{ width: '100%', mb: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} sx={{ mb: 1 }}>
        <Typography variant="subtitle2" color="text.secondary">
          {title}
        </Typography>
        <ToggleButtonGroup
          size="small"
          exclusive
          value={device}
          onChange={(_, value: PreviewDevice | null) => value && setDevice(value)}
          aria-label="Urządzenie"
        >
          <ToggleButton value="desktop" aria-label="Komputer" sx={{ gap: 0.75, px: 1.25 }}>
            <ComputerIcon fontSize="small" />
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
              Komputer
            </Box>
          </ToggleButton>
          <ToggleButton value="phone" aria-label="Telefon" sx={{ gap: 0.75, px: 1.25 }}>
            <SmartphoneIcon fontSize="small" />
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
              Telefon
            </Box>
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>
      <Box ref={outer} sx={{ width: '100%', overflow: 'hidden', display: 'flex', justifyContent: phone ? 'center' : 'flex-start' }}>
        {/* miejsce na zmniejszoną treść (transform nie zmienia rozmiaru w układzie) */}
        <Box sx={{ width: width * scale, height: height * scale, flexShrink: 0 }}>
          <Box
            ref={inner}
            sx={{
              width,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              // ramka „telefonu” w szerokości podglądu (border-box – nie poszerza)
              boxSizing: 'border-box',
              border: phone ? '1px solid' : 'none',
              borderColor: 'divider',
              borderRadius: phone ? 3 : 0,
              overflow: 'hidden',
            }}
          >
            {children(device)}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
