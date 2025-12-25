import { v2 as cloudinary, ConfigOptions } from 'cloudinary';
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} from './env.config';

class CloudinaryClient {
  private static initialized = false;

  static connect(config?: ConfigOptions) {
    if (!CloudinaryClient.initialized) {
      cloudinary.config({
        cloud_name: CLOUDINARY_CLOUD_NAME,
        api_key: CLOUDINARY_API_KEY,
        api_secret: CLOUDINARY_API_SECRET,
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