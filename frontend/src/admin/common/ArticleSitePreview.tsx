import { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import WebIcon from '@mui/icons-material/Web';
import { DevicePreview } from './DevicePreview';

const webUrl = import.meta.env.VITE_WEB_URL || 'http://localhost:3001';
const WEB_ORIGIN = new URL(webUrl).origin;

type FormImage = { src?: string; imgUrl?: string; rawFile?: File | null };
type FormTag = string | { name?: string; tag?: { name: string } };

/** Zdjęcie nowo dodane (jeszcze niewgrane) – jako data: URL, bo adres blob: z panelu nie działa na stronie */
const readFile = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

/** Wpis z formularza w formacie strony (ArticleView) */
async function articleFromForm(values: Record<string, unknown>) {
  const images = await Promise.all(
    ((values.images as FormImage[] | undefined) ?? []).map(async (img) => ({
      imgUrl: img.rawFile ? await readFile(img.rawFile) : (img.imgUrl ?? img.src ?? ''),
    })),
  );
  const tags = ((values.tags as FormTag[] | undefined) ?? [])
    .map((t) => (typeof t === 'string' ? t : (t.tag?.name ?? t.name ?? '')))
    .filter(Boolean)
    .map((name) => ({ tag: { id: name, name } }));
  const publishAt = values.publishAt as string | null | undefined;
  return {
    title: (values.title as string) || 'Tytuł wpisu',
    shortDescription: (values.shortDescription as string) ?? '',
    content: (values.content as string) ?? '',
    publishedAt: publishAt ? new Date(publishAt).toISOString() : new Date().toISOString(),
    images: images.filter((i) => i.imgUrl),
    tags,
  };
}

/** Strona podglądu w ramce: po „gotowe” dostaje wpis, w zamian przysyła swoją wysokość */
function SiteFrame({ article }: { article: unknown }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(900);
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== WEB_ORIGIN || e.source !== frame.current?.contentWindow) return;
      if (e.data?.type === 'chleba-smak:preview-ready')
        frame.current?.contentWindow?.postMessage({ type: 'chleba-smak:article-preview', article }, WEB_ORIGIN);
      if (e.data?.type === 'chleba-smak:preview-height' && typeof e.data.height === 'number') setHeight(e.data.height);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [article]);
  return (
    <iframe
      ref={frame}
      title="Podgląd wpisu na stronie"
      src={`${webUrl}/podglad/wpis`}
      style={{ width: '100%', height, border: 0, display: 'block' }}
    />
  );
}

/**
 * „Podgląd posta na stronie”: niezapisany wpis wyświetlony przez prawdziwą stronę (nagłówek, stopka, kafelki
 * produktów) w ramce, z przełącznikiem Komputer | Telefon. Nic nie zapisuje ani nie publikuje.
 */
export function ArticleSitePreview() {
  const { getValues } = useFormContext();
  const [article, setArticle] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);

  const open = async () => {
    setLoading(true);
    try {
      setArticle(await articleFromForm(getValues()));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button startIcon={<WebIcon />} onClick={open} disabled={loading}>
        Podgląd posta na stronie
      </Button>
      <Dialog open={article !== null} onClose={() => setArticle(null)} maxWidth="xl" fullWidth>
        <DialogTitle>Podgląd wpisu na stronie</DialogTitle>
        <DialogContent sx={{ p: 2 }}>
          {article !== null && (
            <DevicePreview title="Tak wpis będzie wyglądał na stronie">
              {(device) => <SiteFrame key={device} article={article} />}
            </DevicePreview>
          )}
        </DialogContent>
        <DialogActions>
          <Typography variant="caption" color="text.secondary" sx={{ mr: 'auto', pl: 1 }}>
            Podgląd niczego nie zapisuje ani nie publikuje. Kafelki produktów – z cenami z dnia dzisiejszego.
          </Typography>
          <Button onClick={() => setArticle(null)}>Zamknij</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
