import { Box, Paper, Stack, Typography } from '@mui/material';

const webUrl = import.meta.env.VITE_WEB_URL || 'http://localhost:3001';
const SITE_NAME = 'Chleba Smak';

/** Obcięcie jak w Google (z wielokropkiem) */
const cut = (text: string, max: number) => (text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text);

/** Adres zdjęcia do podglądu (zdjęcia strony leżą na stronie, wgrane – na serwerze z pełnym adresem) */
const imageSrc = (url: string) => (url.startsWith('/images/') ? `${webUrl}${url}` : url);

/**
 * Podgląd sekcji SEO: wynik w Google (tytuł, adres, opis – obcięte jak w wyszukiwarce) i karta linku
 * na Facebooku / w Messengerze (zdjęcie, domena, tytuł).
 */
export function SeoPreview({
  title,
  description,
  imageUrl,
  path,
  suffix,
}: {
  title: string;
  description: string;
  imageUrl: string;
  path: string;
  suffix: boolean;
}) {
  const fullTitle = suffix ? `${title} · ${SITE_NAME}` : title;
  const host = new URL(webUrl).host;
  const crumbs = [host, ...path.split('/').filter(Boolean)].join(' › ');
  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
      <Paper variant="outlined" sx={{ p: 2, flex: 1.3, bgcolor: '#fff', color: '#202124' }}>
        <Typography variant="overline" sx={{ color: '#70757a', lineHeight: 1.5 }}>
          Podgląd w Google
        </Typography>
        <Typography sx={{ fontSize: 12, color: '#4d5156', mt: 0.5, fontFamily: 'Arial, sans-serif' }}>
          {SITE_NAME} · {crumbs}
        </Typography>
        <Typography sx={{ fontSize: 20, color: '#1a0dab', lineHeight: 1.3, mt: 0.5, fontFamily: 'Arial, sans-serif' }}>
          {cut(fullTitle || '—', 60)}
        </Typography>
        <Typography sx={{ fontSize: 14, color: '#4d5156', lineHeight: 1.58, mt: 0.5, fontFamily: 'Arial, sans-serif' }}>
          {cut(description || '—', 158)}
        </Typography>
      </Paper>
      <Paper variant="outlined" sx={{ flex: 1, overflow: 'hidden', bgcolor: '#f0f2f5', color: '#050505', maxWidth: { md: 340 } }}>
        <Typography variant="overline" sx={{ color: '#65676b', px: 1.5, lineHeight: 2.5 }}>
          Podgląd linku (Facebook)
        </Typography>
        <Box
          sx={{
            aspectRatio: '1.91 / 1',
            bgcolor: '#ddd',
            backgroundImage: imageUrl ? `url("${imageSrc(imageUrl)}")` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Box sx={{ px: 1.5, py: 1, fontFamily: 'Helvetica, Arial, sans-serif' }}>
          <Typography sx={{ fontSize: 12, color: '#65676b', textTransform: 'uppercase' }}>{host}</Typography>
          <Typography sx={{ fontSize: 16, fontWeight: 600, lineHeight: 1.25 }}>{cut(fullTitle || '—', 80)}</Typography>
          <Typography sx={{ fontSize: 14, color: '#65676b', lineHeight: 1.3 }} noWrap>
            {description}
          </Typography>
        </Box>
      </Paper>
    </Stack>
  );
}
