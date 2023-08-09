import { Options } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';

export interface CustomOptions extends Options {
  folder: string;
  cloudinary: typeof cloudinary;
}