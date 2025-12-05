import crypto from 'crypto';
import { MinioService } from './minio.service';
import { RedisService } from './redis.service';
import { FileDto } from '../dtos/file.dto';
import { IFile } from 'src/models/file.model';
import { fileRepository } from '../repositories/file.repository';
import { fileMapper } from 'src/mappers/file.mapper';

export const FileService = {
  // Upload file lên MinIO và lưu metadata
  async upload(file: Express.Multer.File, userId: string): Promise<FileDto> {
    const checksum = crypto.createHash('sha256').update(file.buffer).digest('hex');
    const existingFile = await fileRepository.findByChecksum(checksum);
    if (existingFile) return fileMapper.toDto(existingFile);

    const fileName = `${Date.now()}-${file.originalname}`;
    const objectName = `${userId}/${fileName}`;
    const uploadResult = await MinioService.upload(objectName, file.buffer, file.mimetype);

    const metadata: Partial<IFile> = {
      filename: file.originalname,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: uploadResult.fileName,
      bucket: uploadResult.bucket,
      checksum,
      provider: 'minio',
      uploadedBy: userId,
    };

    const savedMetadata = await fileRepository.create(metadata);
    await RedisService.setCache(`file:metadata:${savedMetadata.id}`, savedMetadata, 3600);
    return fileMapper.toDto(savedMetadata);
  },

  // Download file từ MinIO
  async download(fileId: string): Promise<{ buffer: Buffer; metadata: FileDto }> {
    const metadata = await this.getById(fileId);
    if (!metadata) throw new Error('File not found');
    const buffer = await MinioService.download(metadata.path);
    return { buffer, metadata };
  },

  // Xóa file
  async delete(fileId: string): Promise<void> {
    const metadata = await this.getById(fileId);
    if (!metadata) throw new Error('File not found');
    await MinioService.delete(metadata.path);
    await RedisService.deleteCache(`file:metadata:${fileId}`);
    await fileRepository.delete(fileId);
  },

  // Lấy metadata file (ưu tiên từ cache)
  async getById(fileId: string): Promise<FileDto | null> {
    const cached = await RedisService.getCache<IFile>(`file:metadata:${fileId}`);
    if (cached) return fileMapper.toDto(cached);

    const metadata = await fileRepository.findById(fileId);
    if (metadata) await RedisService.setCache(`file:metadata:${fileId}`, metadata, 3600);
    return metadata ? fileMapper.toDto(metadata) : null;
  },

  // Truy vấn metadata theo user
  async findByUser(userId: string, page = 1, limit = 20): Promise<FileDto[]> {
    const { items } = await fileRepository.findByUser(userId, page, limit);
    return items.map(e => fileMapper.toDto(e));
  },

  // Truy vấn metadata theo loại file
  async findByMimeType(mimeType: string, page = 1, limit = 20): Promise<FileDto[]> {
    const { items } = await fileRepository.findByMimeType(mimeType, page, limit);
    return items.map(e => fileMapper.toDto(e));
  },

  // Tìm kiếm theo tên file
  async findByFilename(keyword: string, page = 1, limit = 20): Promise<FileDto[]> {
    const { items } = await fileRepository.findByFilename(keyword, page, limit);
    return items.map(e => fileMapper.toDto(e));
  },
};

export default FileService;