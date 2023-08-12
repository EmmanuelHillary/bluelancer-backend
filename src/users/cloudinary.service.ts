import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cloudinary from 'cloudinary';

import { removeUnusedImage } from './utilities';
import { cloudinaryConfig } from '../config/cloudinary.config';
const toStream = require('buffer-to-stream');

@Injectable()
export class Cloudinary {
  logger: Logger;
  cloud: typeof cloudinary.v2 = cloudinaryConfig();

  constructor(private readonly configService: ConfigService) {
    //this.cloud.config(this.configService.get('cloudinary'));
    this.logger = new Logger('UPLOAD_SERVICE');
  }
  async uploadImage(
    file: Express.Multer.File,
  ): Promise<cloudinary.UploadApiResponse | cloudinary.UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = this.cloud.uploader.upload_stream((error, result) => {
        if (error) return reject(error);
        resolve(result);
      });

      toStream(file.buffer).pipe(upload);
    });
  }

}
