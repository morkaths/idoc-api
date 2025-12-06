import { RedisService } from './redis.service';
import { fileRepository } from '../repositories/file.repository';
import { FileDto } from '../dtos/file.dto';
import { IFile } from 'src/models/file.model';
import { fileMapper } from 'src/mappers/file.mapper';
import { MinioService } from './minio.service';
import FileStorageService from './storage.service';

async function toDtoWithUrl(file: IFile | Partial<IFile>): Promise<FileDto> {
  if (!file.objectName) throw new Error('File path is required');
  const dto = fileMapper.toDto(file as IFile);
  dto.url = await FileStorageService.getDownloadUrl(file.objectName); // Gọi qua StorageService
  return dto;
}

export const FileService = {

  async getRawById(fileId: string): Promise<IFile | null> {
    return await fileRepository.findById(fileId);
  },

  async getById(fileId: string): Promise<FileDto | null> {
    const cached = await RedisService.getCache<IFile>(`file:metadata:${fileId}`);
    const metadata = cached || await fileRepository.findById(fileId);
    if (!metadata || !metadata.objectName) return null;
    if (!cached) await RedisService.setCache(`file:metadata:${fileId}`, metadata, 3600);
    return toDtoWithUrl(metadata);
  },

  async findByUser(userId: string, page = 1, limit = 20): Promise<FileDto[]> {
    const { items } = await fileRepository.findByUser(userId, page, limit);
    return Promise.all(items.map(toDtoWithUrl));
  },

  async findByMimeType(mimeType: string, page = 1, limit = 20): Promise<FileDto[]> {
    const { items } = await fileRepository.findByMimeType(mimeType, page, limit);
    return Promise.all(items.map(toDtoWithUrl));
  },

  async findByFilename(keyword: string, page = 1, limit = 20): Promise<FileDto[]> {
    const { items } = await fileRepository.findByFilename(keyword, page, limit);
    return Promise.all(items.map(toDtoWithUrl));
  },

  async create(metadata: Partial<IFile>): Promise<FileDto> {
    const savedMetadata = await fileRepository.create(metadata);
    await RedisService.setCache(`file:metadata:${savedMetadata.id}`, savedMetadata, 3600);
    return toDtoWithUrl(savedMetadata);
  },

  async delete(fileId: string): Promise<void> {
    const metadata = await fileRepository.findById(fileId);
    if (!metadata || !metadata.objectName) throw new Error('File not found');
    await FileStorageService.delete(metadata.objectName);
    await fileRepository.delete(fileId);
    await RedisService.deleteCache(`file:metadata:${fileId}`);
  },

};

export default FileService;