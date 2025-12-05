import crypto from 'crypto';
import { MinioService } from './minio.service';
import { RedisService } from './redis.service';
import { FileDto } from '../dtos/file.dto';
import { IFile } from 'src/models/file.model';
import { fileRepository } from '../repositories/file.repository';
import { fileMapper } from 'src/mappers/file.mapper';

// Helper function để tạo DTO với presigned URL
async function toDtoWithUrl(file: IFile | Partial<IFile>): Promise<FileDto> {
  if (!file.path) throw new Error('File path is required');
  const dto = fileMapper.toDto(file as IFile);
  dto.url = await MinioService.getPresignedUrl(file.path);
  return dto;
}

export const FileService = {
  // Upload file lên MinIO và lưu metadata
  async upload(file: Express.Multer.File, userId: string): Promise<FileDto> {
    const checksum = crypto.createHash('sha256').update(file.buffer).digest('hex');
    const existingFile = await fileRepository.findByChecksum(checksum);
    
    // Kiểm tra deduplication
    if (existingFile && await MinioService.exists(existingFile.path)) {
      return toDtoWithUrl(existingFile);
    }
    
    // Xóa metadata cũ nếu file không tồn tại trên MinIO
    if (existingFile) {
      await fileRepository.delete(existingFile.id);
      await RedisService.deleteCache(`file:metadata:${existingFile.id}`);
    }

    // Upload file mới
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
    return toDtoWithUrl(savedMetadata);
  },

  // Upload nhiều file cùng lúc
  async uploadMultiple(files: Express.Multer.File[], userId: string): Promise<FileDto[]> {
    return Promise.all(files.map(file => this.upload(file, userId)));
  },

  // Download file từ MinIO
  async download(fileId: string): Promise<{ buffer: Buffer; metadata: FileDto }> {
    const cached = await RedisService.getCache<IFile>(`file:metadata:${fileId}`);
    const fileModel = cached || await fileRepository.findById(fileId);
    if (!fileModel || !fileModel.path) throw new Error('File not found');
    
    const [buffer, metadata] = await Promise.all([
      MinioService.download(fileModel.path),
      toDtoWithUrl(fileModel)
    ]);
    
    return { buffer, metadata };
  },

  // Xóa file
  async delete(fileId: string): Promise<void> {
    const cached = await RedisService.getCache<IFile>(`file:metadata:${fileId}`);
    const fileModel = cached || await fileRepository.findById(fileId);
    if (!fileModel || !fileModel.path) throw new Error('File not found');
    
    await Promise.all([
      MinioService.delete(fileModel.path),
      RedisService.deleteCache(`file:metadata:${fileId}`),
      fileRepository.delete(fileId)
    ]);
  },

  // Lấy metadata file (ưu tiên từ cache)
  async getById(fileId: string): Promise<FileDto | null> {
    const cached = await RedisService.getCache<IFile>(`file:metadata:${fileId}`);
    const metadata = cached || await fileRepository.findById(fileId);
    if (!metadata || !metadata.path) return null;
    
    if (!cached) {
      await RedisService.setCache(`file:metadata:${fileId}`, metadata, 3600);
    }
    
    return toDtoWithUrl(metadata);
  },

  // Truy vấn metadata theo user
  async findByUser(userId: string, page = 1, limit = 20): Promise<FileDto[]> {
    const { items } = await fileRepository.findByUser(userId, page, limit);
    return Promise.all(items.map(toDtoWithUrl));
  },

  // Truy vấn metadata theo loại file
  async findByMimeType(mimeType: string, page = 1, limit = 20): Promise<FileDto[]> {
    const { items } = await fileRepository.findByMimeType(mimeType, page, limit);
    return Promise.all(items.map(toDtoWithUrl));
  },

  // Tìm kiếm theo tên file
  async findByFilename(keyword: string, page = 1, limit = 20): Promise<FileDto[]> {
    const { items } = await fileRepository.findByFilename(keyword, page, limit);
    return Promise.all(items.map(toDtoWithUrl));
  },
};

export default FileService;