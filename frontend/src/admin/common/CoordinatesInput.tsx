import { useState } from 'react';
import { NumberInput } from 'react-admin';
import { useFormContext } from 'react-hook-form';
import { Box, Button, Typography } from '@mui/material';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;

interface GeocoderResult {
  geometry: { location: { lat: () => number; lng: () => number } };
  formatted_address: string;
}
interface GoogleMapsGlobal {
  maps: {
    Geocoder: new () => {
      geocode: (request: { address: string; region?: string }) => Promise<{ results: GeocoderResult[] }>;
    };
  };
}

let loader: Promise<GoogleMapsGlobal> | null = null;

// Geocoder z Maps JavaScript API – działa z kluczem ograniczonym do domen (REST API by tego nie przyjął)
function loadGoogleMaps(): Promise<GoogleMapsGlobal> {
  const w = window as unknown as { google?: GoogleMapsGlobal };
  if (w.google?.maps?.Geocoder) return Promise.resolve(w.google);
  loader ??= new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&language=pl&region=PL&loading=async&callback=__gmapsReady`;
    script.async = true;
    (window as unknown as Record<string, unknown>).__gmapsReady = () => resolve(w.google!);
    script.onerror = () => {
      loader = null;
      reject(new Error('Nie udało się załadować Google Maps'));
    };
    document.head.appendChild(script);
  });
  return loader;
}

/** Pola lat/lng do mapy na stronie + automatyczne uzupełnienie z pola „address” */
export const CoordinatesInput = () => {
  const { getValues, setValue } = useFormContext();
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const geocode = async () => {
    const address = String(getValues('address') ?? '').trim();
    if (!address) {
      setStatus('Najpierw wpisz adres.');
      return;
    }
    setBusy(true);
    setStatus(null);
    try {
      const google = await loadGoogleMaps();
      const { results } = await new google.maps.Geocoder().geocode({ address, region: 'pl' });
      const best = results[0];
      if (!best) throw new Error('Nie znaleziono adresu');
      setValue('lat', Number(best.geometry.location.lat().toFixed(7)), { shouldDirty: true });
      setValue('lng', Number(best.geometry.location.lng().toFixed(7)), { shouldDirty: true });
      setStatus(`Znaleziono: ${best.formatted_address}`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Błąd geokodowania');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 600, mb: 2 }}>
      <Typography variant="subtitle2" sx={{ mt: 1 }}>
        Położenie na mapie
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <NumberInput source="lat" label="Szerokość (lat)" step={0.000001} helperText={false} />
        <NumberInput source="lng" label="Długość (lng)" step={0.000001} helperText={false} />
        <Button variant="outlined" onClick={geocode} disabled={!API_KEY || busy}>
          {busy ? 'Szukam…' : 'Uzupełnij z adresu'}
        </Button>
      </Box>
      <Typography variant="caption" color="text.secondary">
        {API_KEY
          ? status ?? 'Bez współrzędnych punkt nie pojawi się na mapie na stronie.'
          : 'Brak VITE_GOOGLE_MAPS_API_KEY w frontend/.env – wpisz współrzędne ręcznie.'}
      </Typography>
    </Box>
  );
};
