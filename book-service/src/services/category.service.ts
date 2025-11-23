import { Types } from "mongoose";
import CategoryRepository from "../repositories/category.repository";
import { ICategory } from "../models/category.model";
import { CategoryDto } from "../dtos/category.dto";
import { BaseService } from "src/core/base.service";
import { CategoryMapper } from "src/mappers/category.mapper";
import CategoryTransRepository from "src/repositories/categoryTrans.repository";
import { CategoryTransMapper } from "src/mappers/categoryTrans.mapper";

class CategoryService extends BaseService<ICategory, CategoryDto> {

    async findAllWithAllTrans(): Promise<CategoryDto[]> {
        const categories = await CategoryRepository.findAllWithAllLangs();
        return categories.map(category =>
            CategoryMapper.toDto(category, category.translation)
        );
    }

    async findAllWithTrans(lang?: string): Promise<CategoryDto[]> {
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

    async create(categoryDto: CategoryDto): Promise<CategoryDto | null> {
        const entity = CategoryMapper.toEntity(categoryDto);
        const category = await CategoryRepository.create(entity);

        if (categoryDto.translations && categoryDto.translations.length > 0) {
            const translations = categoryDto.translations.map(trans => ({
                ...CategoryTransMapper.toEntity(trans),
                categoryId: new Types.ObjectId(category._id as string)
            }));
            await CategoryTransRepository.createMany(translations);
        }
        return CategoryMapper.toDto(category);
    }

    async update(id: string, categoryDto: CategoryDto): Promise<CategoryDto | null> {
        const entity = CategoryMapper.toEntity(categoryDto);
        const category = await CategoryRepository.update(id, entity);
        if (!category) return null;
        if (categoryDto.translations && categoryDto.translations.length > 0) {
            const translations = categoryDto.translations.map(trans => ({
                ...CategoryTransMapper.toEntity(trans),
                categoryId: new Types.ObjectId(category._id as string)
            }));
            await CategoryTransRepository.upsertTranslations(translations);
        }
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

export default new CategoryService(CategoryRepository, CategoryMapper);