import { RedisService } from './redis.service';
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
    const cached = await RedisService.getCache<IFile>(`file:metadata:${key}`);
    const metadata = cached || await fileRepository.findByKey(key);
    if (!metadata || !metadata.objectName) return null;
    if (!cached) await RedisService.setCache(`file:metadata:${key}`, metadata, 3600);
    return toDtoWithUrl(metadata);
  },

  async getByUser(userId: string, page = 1, limit = 20): Promise<FileDto[]> {
    const { items } = await fileRepository.findByUser(userId, page, limit);
    return Promise.all(items.map(toDtoWithUrl));
  },

  async create(metadata: Partial<IFile>): Promise<FileDto> {
    const saved = await fileRepository.create(metadata);
    await RedisService.setCache(`file:metadata:${saved.key}`, saved, 3600);
    return toDtoWithUrl(saved);
  },

  async delete(key: string): Promise<void> {
    const metadata = await fileRepository.findByKey(key);
    if (!metadata || !metadata.objectName) throw new Error('File not found');
    await MinioService.delete(metadata.objectName);
    await fileRepository.delete(key);
    await RedisService.deleteCache(`file:metadata:${key}`);
  },

  async upload(userId: string, file: Express.Multer.File): Promise<FileDto> {
    const result = await MinioService.upload(userId, file);
    const metadata: Partial<IFile> = {
      key: result.key,
      filename: file.originalname,
      objectName: result.objectName,
      mimeType: file.mimetype,
      size: file.size,
      bucket : result.bucket,
      provider: StorageProvider.MINIO,
      uploadedBy: userId
    };
    const savedMetadata = await fileRepository.create(metadata);
    await RedisService.setCache(`file:metadata:${savedMetadata._id}`, savedMetadata, 3600);
    return toDtoWithUrl(savedMetadata);
  },

  async download(key: string): Promise<{ buffer: Buffer, metadata: IFile }> {
    const metadata = await fileRepository.findByKey(key);
    if (!metadata || !metadata.objectName) throw new Error('File not found');
    const buffer = await MinioService.download(metadata.objectName);
    return { buffer, metadata };
  },

};

export default FileService;