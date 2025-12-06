import { v4 as uuidv4 } from 'uuid';
import { MinioService } from './minio.service';
import { RedisService } from './redis.service';
import { IFile } from 'src/models/file.model';
import { MINIO_BUCKET } from 'src/config/env.config';

export const FileStorageService = {
  async uploadDirect(
    userId: string,
    file: Express.Multer.File
  ): Promise<{ bucket: string; objectName: string }> {
    const objectName = `${userId}/${Date.now()}-${uuidv4()}`;
    return await MinioService.upload(objectName, file.buffer, file.mimetype);
  },

  async upload(userId: string, filename: string, type: string): Promise<{ url: string; objectName: string; uploadId: string }> {
    const uploadId = uuidv4();
    const objectName = `${type}/${Date.now()}-${uuidv4()}`;
    const url = await MinioService.getPresignedUploadUrl(objectName);

    const pendingMetadata: Partial<IFile> = {
      filename,
      objectName,
      type,
      bucket: MINIO_BUCKET,
      provider: 'minio',
      uploadedBy: userId
    };

    await RedisService.setCache(`upload:pending:${uploadId}`, pendingMetadata, 600);
    return { url, objectName, uploadId };
  },

  async confirm(userId: string, uploadId: string): Promise<Partial<IFile>> {
    const pending = await RedisService.getCache<Partial<IFile>>(`upload:pending:${uploadId}`);
    if (!pending || !pending.objectName) throw new Error('Upload session expired or not found');
    const stat = await MinioService.stat(pending.objectName);
    if (!stat) throw new Error('File not found on storage');

    const metadata: Partial<IFile> = {
      filename: pending.filename,
      objectName: pending.objectName,
      mimeType: stat.metaData?.['content-type'] || 'application/octet-stream',
      type: pending.type,
      size: stat.size,
      bucket: pending.bucket,
      provider: pending.provider,
      uploadedBy: userId
    };

    await RedisService.deleteCache(`upload:pending:${uploadId}`);
    return metadata;
  },

  async download(objectName: string): Promise<Buffer> {
    return MinioService.download(objectName);
  },

  async getDownloadUrl(objectName: string, expirySeconds = 3600): Promise<string> {
    if (!objectName) {
      throw new Error('objectName is required');
    }
    return MinioService.getPresignedDownloadUrl(objectName, expirySeconds);
  },

  async delete(objectName: string): Promise<void> {
    await MinioService.delete(objectName);
  },
};

export default FileStorageService;