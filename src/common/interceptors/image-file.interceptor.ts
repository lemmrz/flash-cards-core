import { BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export function ImageFileInterceptor(fieldName: string, maxFileSizeMB = 2) {
  const multerOptions: MulterOptions = {
    limits: {
      fileSize: maxFileSizeMB * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
      const allowedMimeTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/bmp',
      ];
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(
          new BadRequestException(
            `Only image files are allowed: ${allowedMimeTypes.join(', ')}`,
          ),
          false,
        );
      }
      cb(null, true);
    },
  };

  return FileInterceptor(fieldName, multerOptions);
}
