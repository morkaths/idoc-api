import { FileMetadataRepository } from "../repositories/file-metadata.repository";
import { FileMetadataDto } from "../dtos/file-metadata.dto";
import { IFileMetadata } from "../models/file-metadata.model";
import { BaseService } from "../core/base.service";
import { fileMetadataMapper } from "../mappers/file-metadata.mapper";

export class FileMetadataService extends BaseService<IFileMetadata, FileMetadataDto> {
  constructor() {
    super(new FileMetadataRepository(), fileMetadataMapper);
  }

  async findByChecksum(checksum: string): Promise<FileMetadataDto | null> {
    const entity = await (this.repository as FileMetadataRepository).findByChecksum(checksum);
    return entity ? this.mapper.toDto(entity) : null;
  }

  async findByProviderAndPath(provider: string, path: string): Promise<FileMetadataDto | null> {
    const entity = await (this.repository as FileMetadataRepository).findByProviderAndPath(provider, path);
    return entity ? this.mapper.toDto(entity) : null;
  }
}

export default new FileMetadataService();