import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'event_posters',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  }as any
});

export const upload = multer({ storage: storage });

export const uploadToCloudinary = async (file: Express.Multer.File): Promise<string> => {
  try {
    if (!file || !file.path) {
      throw new Error('No file uploaded');
    }

    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'event_posters',
      allowed_formats: ['jpg', 'png', 'jpeg'],
      transformation: [{ width: 500, height: 500, crop: 'limit' }]
    });

    return result.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload image');
  }
};
