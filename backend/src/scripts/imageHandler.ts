import * as fs from 'fs/promises';
import { URL } from 'url';
import { join } from 'path';

export function extractFilenameFromUrl(imgUrl: string): string | null {
  try {
    const url = new URL(imgUrl);
    const pathname = url.pathname; // np. /uploads/abc.jpg
    const parts = pathname.split('/');
    return parts[parts.length - 1] || null;
  } catch {
    return null;
  }
}

export default async function deleteImageFiles(
  imgUrls: string[],
): Promise<void> {
  await Promise.all(
    imgUrls.map(async (url) => {
      const filename: string | null = extractFilenameFromUrl(url);
      if (!filename) return;
      const fullPath = join(process.cwd(), 'uploads', filename);
      try {
        await fs.unlink(fullPath);
      } catch {
        // ignorujemy, jeśli pliku już nie ma
      }
    }),
  );
}
