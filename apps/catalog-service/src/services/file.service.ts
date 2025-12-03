import FileRepository from "src/repositories/file.repository";
import { BaseService } from "src/core/base.service";
import { FileDto } from "src/dtos/file.dto";
import { IFile } from "src/models/file.model";
import { FileMapper } from "src/mappers/file.mapper";
import { CategoryMapper } from "src/mappers/category.mapper";
import CategoryRepository from "src/repositories/category.repository";
import { Types } from "mongoose";
import { Pagination } from "src/types";

class FileService extends BaseService<IFile, FileDto> {
  constructor() {
    super(FileRepository, FileMapper);
  }

  private mapFileToDto(file: any): FileDto {
    return FileMapper.toDto(
      file,
      file.categories?.map((category: any) =>
        CategoryMapper.toDto(category, category.translation)
      ) ?? []
    );
  }

  async findAll(lang?: string): Promise<FileDto[]> {
    const files = await FileRepository.findAll(lang);
    return files.map((f: any) => this.mapFileToDto(f));
  }

  async findById(id: string, lang?: string): Promise<FileDto | null> {
    const file = await FileRepository.findById(id, lang);
    if (!file) return null;
    return this.mapFileToDto(file);
  }

  async findByCategory(categorySlug: string, lang?: string): Promise<FileDto[]> {
    const category = await CategoryRepository.findOne({ slug: categorySlug }) as any | null;
    if (!category) return [];

    const categoryId = (category._id as Types.ObjectId).toString();
    const files = await FileRepository.findByCategory(categoryId, lang);
    return files.map((f: any) => this.mapFileToDto(f));
  }

  async search(params: { [key: string]: any }): Promise<{ data: FileDto[]; pagination: Pagination }> {
    const result = await FileRepository.search(params);
    const data = (result.items || []).map((f: any) => this.mapFileToDto(f));

    return {
      data,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        pages: result.pages
      }
    };
  }

  async create(fileDto: FileDto, lang?: string): Promise<FileDto> {
    const entity = FileMapper.toEntity(fileDto);
    const file = await FileRepository.create(entity);

    const fileWithRelations = await FileRepository.findById((file._id as Types.ObjectId).toString(), lang);
    return fileWithRelations ? this.mapFileToDto(fileWithRelations) : FileMapper.toDto(file);
  }

  async update(id: string, fileDto: FileDto, lang?: string): Promise<FileDto | null> {
    const entity = FileMapper.toEntity(fileDto);
    const file = await FileRepository.update(id, entity);
    if (!file) return null;

    const fileWithRelations = await FileRepository.findById(id, lang);
    return fileWithRelations ? this.mapFileToDto(fileWithRelations) : FileMapper.toDto(file);
  }

  async delete(id: string): Promise<boolean> {
    return await FileRepository.delete(id);
  }
}

export default new FileService();