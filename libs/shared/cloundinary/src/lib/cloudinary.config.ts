import { v2 as cloudinary, ConfigOptions } from 'cloudinary';

export class CloudinaryClient {
  private static initialized = false;

  static connect(config?: ConfigOptions) {
    if (!CloudinaryClient.initialized) {
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            console.warn('Cloudinary environment variables are missing. Cloudinary might not work correctly.');
        }

      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
        ...config,
      });
      CloudinaryClient.initialized = true;
      console.log('Cloudinary connected');
    }
    return cloudinary;
  }

  static get() {
    if (!CloudinaryClient.initialized) {
      throw new Error('Cloudinary not initialized. Call CloudinaryClient.connect() first.');
    }
    return cloudinary;
  }
}

export default CloudinaryClient;
