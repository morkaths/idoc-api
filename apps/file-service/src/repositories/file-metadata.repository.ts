import { BaseRepository } from "../core/base.repository";
import { FileMetadata, IFileMetadata } from "../models/file-metadata.model";

export class FileMetadataRepository extends BaseRepository<IFileMetadata> {
  constructor() {
    super(FileMetadata);
  }

  async findByChecksum(checksum: string) {
    return this.findOne({ checksum });
  }

  async findByProviderAndPath(provider: string, path: string) {
    return this.findOne({ provider, path });
  }
}

export const fileMetadataRepository = new FileMetadataRepository();