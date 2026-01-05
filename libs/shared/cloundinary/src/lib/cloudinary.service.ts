import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';
import CloudinaryClient from './cloudinary.config';

// Ensure connection is established when service is loaded/used, 
// though ideally this should be called at app bootstrap.
// We'll expose a method to init, or rely on the user to init.
// For now, mirroring existing behavior:
CloudinaryClient.connect();

export class CloudinaryService {
    static async upload(buffer: Buffer, folder = 'uploads'): Promise<UploadApiResponse> {
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result as UploadApiResponse);
                }
            );
            Readable.from(buffer).pipe(stream);
        });
    }

    static async delete(publicId: string): Promise<{ result: string }> {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(publicId, (error, result) => {
                if (error) return reject(error);
                resolve(result as { result: string });
            });
        });
    }
}
