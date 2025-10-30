import CategoryRepository from "../repositories/category.repository";
import { ICategory } from "../models/category.model";
import { CategoryDto } from "../dtos/category.dto";
import { BaseService } from "src/core/base.service";
import { CategoryMapper } from "src/mappers/category.mapper";
import { CategoryTranslation } from "src/models/categoryTranslation.model";

class CategoryService extends BaseService<ICategory, CategoryDto> {
    async findAllWithTrans(lang: string): Promise<CategoryDto[]> {
        const categories = await CategoryRepository.findAll(lang);
        return categories.map(category =>
            CategoryMapper.toDto(category, category.translation)
        );
    }

    async findByIdWithTrans(id: string, lang?: string): Promise<CategoryDto | null> {
        const category = await CategoryRepository.findById(id, lang);
        if (!category) return null;
        return CategoryMapper.toDto(category, category.translation);
    }

    async searchWithTrans(query: string, lang?: string): Promise<CategoryDto[]> {
        const categories = await CategoryRepository.search(query, lang);
        return categories.map(category =>
            CategoryMapper.toDto(category, category.translation)
        );
    }

    async create(categoryDto: CategoryDto): Promise<CategoryDto> {
        const entity = CategoryMapper.toEntity(categoryDto);
        const category = await CategoryRepository.create(entity);
        return CategoryMapper.toDto(category);
    }

    async update(id: string, categoryDto: CategoryDto): Promise<CategoryDto | null> {
        const entity = CategoryMapper.toEntity(categoryDto);
        const category = await CategoryRepository.update(id, entity);
        if (categoryDto.translation) {
            const translation = categoryDto.translation;
            await CategoryTranslation.updateOne(
                { categoryId: id, lang: translation.lang },
                {
                    $set: {
                        name: translation.name,
                        description: translation.description
                    }
                },
                { upsert: true }
            );
        }
        // Trả về category đã cập nhật (kèm bản dịch mới nhất)
        const updated = await CategoryRepository.findById(id, categoryDto.translation?.lang);
        return updated ? CategoryMapper.toDto(updated, updated.translation) : null;
    }

    async delete(id: string): Promise<boolean> {
        const result = await CategoryRepository.delete(id);
        return !!result;
    }
}

export default new CategoryService(CategoryRepository, CategoryMapper);