import { v2 as cloudinary } from 'cloudinary';

export const cloudinaryConfig = () => {
  let cloud: typeof cloudinary = cloudinary;
  cloud.config({
    cloud_name: 'dn7bdsevb',
    api_key: '591274433979586',
    api_secret: 'igBpVODxqAgYKpMGXHz62F47AWk',
  });
  return cloud;
};