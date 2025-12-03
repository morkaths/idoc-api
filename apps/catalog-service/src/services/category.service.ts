import { Types } from "mongoose";
import CategoryRepository from "../repositories/category.repository";
import { ICategory } from "../models/category.model";
import { CategoryDto } from "../dtos/category.dto";
import { BaseService } from "src/core/base.service";
import { CategoryMapper } from "src/mappers/category.mapper";
import CategoryTransRepository from "src/repositories/category-translation.repository";
import { CategoryTransMapper } from "src/mappers/category-translation.mapper";
import { Pagination } from "src/types";

class CategoryService extends BaseService<ICategory, CategoryDto> {

    constructor() {
        super(CategoryRepository, CategoryMapper);
    }

    /**
     * Helper: Xử lý translations khi tạo hoặc cập nhật category
     */
    private async handleTranslations(categoryId: string, translations?: any[]) {
        const categoryObjectId = new Types.ObjectId(categoryId);
        if (!translations || translations.length === 0) {
            await CategoryTransRepository.deleteMany({ categoryId: categoryObjectId });
            return;
        }
        const newLangs = translations.map(t => t.lang);
        // Xóa các translation không còn trong danh sách
        await CategoryTransRepository.deleteMany({
            categoryId: categoryObjectId,
            lang: { $nin: newLangs }
        });
        // Upsert các translation mới hoặc đã tồn tại
        const transEntities = translations.map(trans => ({
            ...CategoryTransMapper.toEntity(trans),
            categoryId: categoryObjectId
        }));
        await CategoryTransRepository.upsertTranslations(transEntities);
    }

    async findAll(lang?: string): Promise<CategoryDto[]> {
        const categories = await CategoryRepository.findAll(lang);
        return categories.map(category =>
            CategoryMapper.toDto(category, category.translation)
        );
    }

    async findById(id: string, lang?: string): Promise<CategoryDto | null> {
        const category = await CategoryRepository.findById(id, lang);
        if (!category) return null;
        return CategoryMapper.toDto(category, category.translation);
    }

    async search(params: { [key: string]: any }): Promise<{ data: CategoryDto[]; pagination: Pagination }> {
        const result = await CategoryRepository.search(params);
        const data = (result.items || []).map((category: any) =>
            CategoryMapper.toDto(category, category.translation)
        );

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

    async create(categoryDto: CategoryDto): Promise<CategoryDto> {
        const entity = CategoryMapper.toEntity(categoryDto);
        const category = await CategoryRepository.create(entity);
        await this.handleTranslations(category._id as unknown as string, categoryDto.translations);
        return CategoryMapper.toDto(category);
    }

    async update(id: string, categoryDto: CategoryDto): Promise<CategoryDto | null> {
        const entity = CategoryMapper.toEntity(categoryDto);
        const category = await CategoryRepository.update(id, entity);
        if (!category) return null;
        await this.handleTranslations(id, categoryDto.translations);
        return CategoryMapper.toDto(category);
    }

    async delete(id: string): Promise<boolean> {
        const result = await CategoryRepository.delete(id);
        if (result) {
            await CategoryTransRepository.deleteMany({ categoryId: id });
        }
        return !!result;
    }
}

export default new CategoryService();