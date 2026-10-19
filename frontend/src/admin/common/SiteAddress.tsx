import { useRecordContext } from 'react-admin';
import { Link, Typography } from '@mui/material';

const webUrl = import.meta.env.VITE_WEB_URL || 'http://localhost:3001';

/**
 * Adres produktu / wpisu na stronie (tylko do odczytu) – nadawany automatycznie z nazwy przy dodaniu
 * i niezmienny, żeby udostępnione linki i pozycja w Google nie przepadały po poprawce nazwy.
 */
export const SiteAddress = ({ section }: { section: 'oferta' | 'aktualnosci' }) => {
  const record = useRecordContext<{ slug?: string | null }>();
  if (!record?.slug) return null;
  const url = `${webUrl}/${section}/${record.slug}`;
  return (
    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
      Adres na stronie:{' '}
      <Link href={url} target="_blank" rel="noreferrer">
        /{section}/{record.slug}
      </Link>{' '}
      – nadany automatycznie z nazwy; nie zmienia się po jej poprawce, żeby udostępnione linki działały.
    </Typography>
  );
};
