import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { mkdir, stat } from 'fs/promises';
import { dirname, join } from 'path';
import sharp from 'sharp';
import { Public } from '../auth/auth.decorators';

const UPLOADS = join(process.cwd(), 'uploads');
// gotowe warianty – w katalogu z kropką (statyczny /uploads go nie udostępnia)
const CACHE = join(UPLOADS, '.warianty');
const SAFE_PATH = /^(?:[a-z0-9_-]+\/)*[a-z0-9._-]+\.(?:jpe?g|png|webp)$/i;

/** Warianty zdjęć o stałym rozmiarze – tam, gdzie nie da się przyciąć CSS-em (e-maile) */
const VARIANTS = {
  // kafelek produktu w newsletterze: 150 × 188 px w e-mailu, 2× dla ekranów o dużej gęstości
  kafelek: { width: 300, height: 375 },
} as const;

/**
 * GET /media/kafelek/<ścieżka w uploads> – zdjęcie przycięte do stałego kadru (fragment z „treścią” zdjęcia),
 * JPEG. Tworzone przy pierwszym użyciu i zapamiętywane; nazwy wgranych plików są unikalne, więc wariant się nie starzeje.
 */
@Public()
@Controller('media')
export class ImageVariantsController {
  @Get(':variant/*path')
  async variant(
    @Param('variant') variant: string,
    @Param('path') path: string | string[],
    @Res() res: Response,
  ) {
    const size = VARIANTS[variant as keyof typeof VARIANTS];
    const relative = Array.isArray(path) ? path.join('/') : path;
    if (
      !size ||
      !SAFE_PATH.test(relative) ||
      relative.split('/').includes('..')
    )
      throw new BadRequestException('Nieprawidłowy adres zdjęcia');

    const source = join(UPLOADS, relative);
    const target = join(CACHE, variant, relative.replace(/\.\w+$/, '.jpg'));
    if (!(await exists(target))) {
      if (!(await exists(source))) throw new NotFoundException();
      await mkdir(dirname(target), { recursive: true });
      await sharp(source)
        .rotate() // orientacja z EXIF (zdjęcia z telefonu)
        .resize(size.width, size.height, {
          fit: 'cover',
          position: sharp.strategy.attention,
        })
        .jpeg({ quality: 82, mozjpeg: true })
        .toFile(target);
    }
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    // katalog z kropką: Express domyślnie takich nie wysyła – tu to nasz własny, zaufany plik
    res.type('image/jpeg').sendFile(target, { dotfiles: 'allow' });
  }
}

const exists = (file: string) =>
  stat(file).then(
    (s) => s.isFile(),
    () => false,
  );

/** Adres wariantu dla adresu zdjęcia z /uploads; inne adresy (np. zdjęcia ze strony) bez zmian */
export function variantUrl(
  imageUrl: string,
  variant: keyof typeof VARIANTS,
): string {
  return imageUrl.replace(/\/uploads\//, `/media/${variant}/`);
}
