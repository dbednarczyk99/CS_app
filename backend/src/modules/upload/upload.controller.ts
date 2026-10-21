import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { randomBytes } from 'crypto';
import { open, rename, unlink } from 'fs/promises';
import { diskStorage } from 'multer';
import { join } from 'path';
import type { Request } from 'express';
import { Roles, BLOG_ROLES } from '../auth/auth.decorators';

interface UploadedFileInfo {
  filename: string;
  path: string;
}

const MAX_SIZE = 10 * 1024 * 1024;
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp'];

/** Rozpoznanie typu po pierwszych bajtach pliku (nazwa i typ podany przez przeglądarkę mogą być fałszywe) */
export function detectImage(head: Buffer): 'jpg' | 'png' | 'webp' | null {
  if (head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff) return 'jpg';
  if (
    head
      .subarray(0, 8)
      .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  )
    return 'png';
  if (
    head.toString('ascii', 0, 4) === 'RIFF' &&
    head.toString('ascii', 8, 12) === 'WEBP'
  )
    return 'webp';
  return null;
}

/**
 * Wgrywanie zdjęć z panelu: tylko JPG, PNG, WebP do 10 MB. Typ sprawdzany po zawartości pliku,
 * nazwa losowa z rozszerzeniem wynikającym z typu – nie da się wgrać strony HTML, skryptu ani SVG.
 */
@Roles(...BLOG_ROLES)
@Controller('upload')
export class UploadController {
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: MAX_SIZE, files: 1, fields: 5 },
      fileFilter: (req, file, cb) =>
        ALLOWED_MIME.includes(file.mimetype)
          ? cb(null, true)
          : cb(
              new BadRequestException(
                'Dozwolone są tylko zdjęcia JPG, PNG i WebP',
              ),
              false,
            ),
      storage: diskStorage({
        destination: './uploads',
        // tymczasowa nazwa bez rozszerzenia – właściwą nadajemy po sprawdzeniu zawartości
        filename: (req, file, cb) =>
          cb(null, `tmp-${randomBytes(12).toString('hex')}`),
      }),
    }),
  )
  async uploadFile(
    @UploadedFile() file: UploadedFileInfo | undefined,
    @Req() req: Request,
  ) {
    if (!file) throw new BadRequestException('Brak pliku');

    const head = Buffer.alloc(12);
    const handle = await open(file.path, 'r');
    try {
      await handle.read(head, 0, 12, 0);
    } finally {
      await handle.close();
    }
    const type = detectImage(head);
    if (!type) {
      await unlink(file.path).catch(() => undefined);
      throw new BadRequestException('Plik nie jest zdjęciem JPG, PNG ani WebP');
    }

    const filename = `${Date.now()}-${randomBytes(6).toString('hex')}.${type}`;
    await rename(file.path, join('./uploads', filename));

    const host = req.get('host') ?? 'localhost:3000';
    return { url: `${req.protocol}://${host}/uploads/${filename}`, filename };
  }
}
