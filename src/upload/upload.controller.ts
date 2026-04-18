import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Controller('admin/upload')
@UseGuards(AuthGuard('jwt'))
export class UploadController {
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 6 * 1024 * 1024 },
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) => {
          const ext = extname(file.originalname).toLowerCase() || '.webp';
          cb(null, `${uuidv4()}${ext}`);
        },
      }),
      fileFilter: (_req, file, cb) => {
        const ok = /^image\/(jpeg|png|gif|webp|svg\+xml)$/.test(file.mimetype);
        cb(null, ok);
      },
    }),
  )
  upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) return { url: '' };
    return { url: `/uploads/${file.filename}` };
  }
}
