import { Types } from "mongoose";
import { ICategory } from "../models/category.model";
import { CategoryDto } from "../dtos/category.dto";
import { BaseService } from "src/core/base.service";
import { categoryRepository } from "../repositories/category.repository";
import { categoryTransRepository } from "src/repositories/category-translation.repository";
import { CategoryMapper } from "src/mappers/category.mapper";
import { CategoryTransMapper } from "src/mappers/category-translation.mapper";
import { Pagination } from "src/types";

class CategoryService extends BaseService<ICategory, CategoryDto> {

	constructor() {
		super(categoryRepository, CategoryMapper);
	}

	/**
	 * Helper: Xử lý translations khi tạo hoặc cập nhật category
	 */
	private async handleTranslations(categoryId: string, translations?: any[]) {
		const categoryObjectId = new Types.ObjectId(categoryId);
		if (!translations || translations.length === 0) {
			await categoryTransRepository.deleteMany({ categoryId: categoryObjectId });
			return;
		}
		const newLangs = translations.map(t => t.lang);
		// Xóa các translation không còn trong danh sách
		await categoryTransRepository.deleteMany({
			categoryId: categoryObjectId,
			lang: { $nin: newLangs }
		});
		// Upsert các translation mới hoặc đã tồn tại
		const transEntities = translations.map(trans => ({
			...CategoryTransMapper.toEntity(trans),
			categoryId: categoryObjectId
		}));
		await categoryTransRepository.upsertTranslations(transEntities);
	}

	async getList(
		page: number,
		limit: number,
		filter: { [key: string]: any }
	): Promise<{ data: CategoryDto[]; pagination: Pagination }> {
		const result = await categoryRepository.findList(page, limit, filter);
		const data = (result.items || []).map((category: any) =>
			CategoryMapper.toDto(category, category.translation)
		);
		return { data, pagination: result.pagination };
	}

	async getById(id: string, lang?: string): Promise<CategoryDto | null> {
		const category = await categoryRepository.findById(id, lang);
		if (!category) return null;
		return CategoryMapper.toDto(category, category.translation);
	}

	async create(categoryDto: CategoryDto): Promise<CategoryDto> {
		const entity = CategoryMapper.toEntity(categoryDto);
		const category = await categoryRepository.create(entity);
		await this.handleTranslations(category._id as unknown as string, categoryDto.translations);
		return CategoryMapper.toDto(category);
	}

	async update(id: string, categoryDto: CategoryDto): Promise<CategoryDto | null> {
		const entity = CategoryMapper.toEntity(categoryDto);
		const category = await categoryRepository.update(id, entity);
		if (!category) return null;
		await this.handleTranslations(id, categoryDto.translations);
		return CategoryMapper.toDto(category);
	}

	async delete(id: string): Promise<boolean> {
		const result = await categoryRepository.delete(id);
		if (result) {
			await categoryTransRepository.deleteMany({ categoryId: id });
		}
		return !!result;
	}
}

export default new CategoryService();