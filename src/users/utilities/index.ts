import * as fs from 'fs';

export const removeUnusedImage = async (imagePath = '') => {
  try {
    if (!imagePath) return;

    const fileExists = fs.existsSync(imagePath);
    if (!fileExists) return;

    await fs.promises.rm(imagePath);
  } catch (error) {
    console.log('Error: ', error);
  }
};
