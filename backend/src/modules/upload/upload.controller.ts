import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import type { Request } from 'express';

interface UploadedFileInfo {
  filename: string;
  originalname: string;
}

@Controller('upload')
export class UploadController {
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const originalName = (file.originalname || 'file') as string;
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const extension = extname(originalName);
          cb(null, `${uniqueSuffix}${extension}`);
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file: UploadedFileInfo, @Req() req: Request) {
    const host = req.get('host') ?? 'localhost:3000';
    const baseUrl = `${req.protocol}://${host}`;
    const url = `${baseUrl}/uploads/${file.filename}`;

    return {
      url,
      filename: file.filename,
    };
  }
}
