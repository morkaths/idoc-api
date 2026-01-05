import { RedisClient } from '@libs/redis';
import { fileRepository } from '../repositories/file.repository';
import { FileDto } from '../dtos/file.dto';
import { IFile, StorageProvider } from 'src/models/file.model';
import { fileMapper } from 'src/mappers/file.mapper';
import { MinioService } from './minio.service';

async function toDtoWithUrl(file: IFile | Partial<IFile>): Promise<FileDto> {
  if (!file.objectName) throw new Error('File path is required');
  const dto = fileMapper.toDto(file as IFile);
  dto.url = await MinioService.getPresignedDownloadUrl(file.objectName);
  return dto;
}

export const FileService = {

  async getList(
    page: number,
    limit: number,
    filter: { [key: string]: any }
  ): Promise<{ data: FileDto[]; pagination: any }> {
    const result = await fileRepository.findList(page, limit, filter);
    const data = await Promise.all(result.items.map(toDtoWithUrl));
    return { data, pagination: result.pagination };
  },

  async getByKey(key: string): Promise<FileDto | null> {
    const cached = await RedisClient.get<IFile>(`file:metadata:${key}`);
    const metadata = cached || await fileRepository.findByKey(key);
    if (!metadata || !metadata.objectName) return null;
    if (!cached) await RedisClient.set(`file:metadata:${key}`, metadata, 3600);
    return toDtoWithUrl(metadata);
  },

  async getByUser(userId: string, page = 1, limit = 20): Promise<FileDto[]> {
    const { items } = await fileRepository.findByUser(userId, page, limit);
    return Promise.all(items.map(toDtoWithUrl));
  },

  async getUploadUrl(userId: string, filename: string, type: string, folder: string): Promise<{ url: string; key: string }> {
    return MinioService.getPresignedUploadUrl(userId, filename, type, folder);
  },

  async getDownloadUrl(key: string, expirySeconds = 21600): Promise<string> {
    const metadata = await fileRepository.findByKey(key);
    if (!metadata || !metadata.objectName) throw new Error('File not found');
    return MinioService.getPresignedDownloadUrl(metadata.objectName, expirySeconds);
  },

  async upload(userId: string, file: Express.Multer.File): Promise<FileDto> {
    const result = await MinioService.upload(userId, file);
    const metadata: Partial<IFile> = {
      key: result.key,
      filename: file.originalname,
      objectName: result.objectName,
      mimeType: file.mimetype,
      size: file.size,
      bucket: result.bucket,
      provider: StorageProvider.MINIO,
      uploadedBy: userId
    };
    const savedMetadata = await fileRepository.create(metadata);
    await RedisClient.set(`file:metadata:${savedMetadata.key}`, savedMetadata, 3600);
    return toDtoWithUrl(savedMetadata);
  },

  async confirm(userId: string, key: string): Promise<FileDto> {
    const metadata = await MinioService.confirmUpload(userId, key);
    const saved = await fileRepository.create(metadata);
    await RedisClient.set(`file:metadata:${saved.key}`, saved, 3600);
    return toDtoWithUrl(saved);
  },

  async download(key: string): Promise<{ buffer: Buffer, metadata: IFile }> {
    const metadata = await fileRepository.findByKey(key);
    if (!metadata || !metadata.objectName) throw new Error('File not found');
    const buffer = await MinioService.download(metadata.objectName);
    return { buffer, metadata };
  },

  async delete(key: string): Promise<void> {
    const metadata = await fileRepository.findByKey(key);
    if (!metadata || !metadata.objectName) throw new Error('File not found');
    await MinioService.delete(metadata.objectName);
    await fileRepository.delete(key);
    await RedisClient.delete(`file:metadata:${key}`);
  },

};

export default FileService;