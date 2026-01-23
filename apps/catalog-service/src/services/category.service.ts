import { Types } from "mongoose";
import { ICategory } from "../models/category.model";
import { CategoryDto } from "../dtos/category.dto";
import { CategoryTranslationDto } from "../dtos/category-translation.dto";
import { BaseService } from '@libs/core';
import { ExcelService, ExcelColumn } from '@libs/excel';
import { categoryRepository } from "../repositories/category.repository";
import { categoryTransRepository } from "../repositories/category-translation.repository";
import { CategoryMapper } from "../mappers/category.mapper";
import { CategoryTransMapper } from "../mappers/category-translation.mapper";
import { Pagination } from "../types";

class CategoryService extends BaseService<ICategory, CategoryDto> {

	constructor() {
		super(categoryRepository, CategoryMapper);
	}

	/**
	 * Helper: Xử lý translations khi tạo hoặc cập nhật category
	 */
	private async handleTranslations(categoryId: string, translations?: CategoryTranslationDto[]) {
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

	/**
	 * Lấy danh sách category với phân trang và bộ lọc
	 * @param page 
	 * @param limit 
	 * @param filter 
	 */
	async findList(
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

	/**
	 * Lấy chi tiết category theo ID
	 * @param id 
	 * @param lang 
	 */
	async findById(id: string, lang?: string): Promise<CategoryDto | null> {
		const category = await categoryRepository.findById(id, lang);
		if (!category) return null;
		return CategoryMapper.toDto(category, category.translation);
	}

	/**
	 * Tạo mới category
	 * @param categoryDto 
	 */
	async create(categoryDto: Partial<CategoryDto>): Promise<CategoryDto> {
		const entity = CategoryMapper.toEntity(categoryDto);
		const category = await categoryRepository.create(entity);
		await this.handleTranslations(category._id as unknown as string, categoryDto.translations);
		return CategoryMapper.toDto(category);
	}

	/**
	 * Tạo nhiều category (Override để xử lý translations)
	 * @param dtos 
	 */
	async createMany(dtos: Partial<CategoryDto>[]): Promise<CategoryDto[]> {
		const results: CategoryDto[] = [];
		for (const dto of dtos) {
			// Gọi create của chính service này để reuse logic handleTranslations
			results.push(await this.create(dto));
		}
		return results;
	}

	/**
	 * Cập nhật category
	 * @param id 
	 * @param categoryDto 
	 */
	async update(id: string, categoryDto: Partial<CategoryDto>): Promise<CategoryDto | null> {
		const entity = CategoryMapper.toEntity(categoryDto);
		const category = await categoryRepository.update(id, entity);
		if (!category) return null;
		await this.handleTranslations(id, categoryDto.translations);
		return CategoryMapper.toDto(category);
	}

	/**
	 * Xóa category
	 * @param id 
	 */
	async delete(id: string): Promise<boolean> {
		const result = await categoryRepository.delete(id);
		if (result) {
			await categoryTransRepository.deleteMany({ categoryId: id });
		}
		return !!result;
	}

	/**
	 * Import dữ liệu từ file Excel
	 * @param buffer 
	 */
	async importExcel(buffer: Buffer): Promise<{ total: number; success: number; errors: any[] }> {
		const excelService = new ExcelService();
		const rows = await excelService.readExcel<any>(buffer);

		if (!rows || rows.length === 0) {
			throw new Error('No data found in Excel file');
		}

		const errors: any[] = [];
		let successCount = 0;

		// 1. Group rows by Slug
		const groups = new Map<string, any[]>();
		rows.forEach((row, index) => {
			if (!row.slug) {
				errors.push({ row: index + 2, error: 'Slug is required' });
				return;
			}
			const slug = row.slug.trim();
			if (!groups.has(slug)) {
				groups.set(slug, []);
			}
			groups.get(slug)?.push({ row, index: index + 2 });
		});

		// 2. Batch Check Existence (Optimization: Query once instead of N times)
		const allSlugs = Array.from(groups.keys());
		// Find all existing categories that match any of the slugs
		const existingCategories = await categoryRepository.find({ slug: { $in: allSlugs } });
		// Create a Set for O(1) lookup
		const existingSlugs = new Set(existingCategories.map(c => c.slug));

		// 3. Process each Group
		for (const [slug, items] of groups) {
			try {
				// Check existence using the pre-fetched set
				if (existingSlugs.has(slug)) {
					items.forEach(item => {
						errors.push({ row: item.index, error: `Category '${slug}' already exists` });
					});
					continue;
				}

				// Build/Merge Translations
				const translations: CategoryTranslationDto[] = items.map(item => ({
					lang: item.row.lang || 'vi',
					name: item.row.name || slug,
					description: item.row.description
				}));

				const dto: Partial<CategoryDto> = {
					slug: slug,
					translations: translations
				};

				await this.create(dto);
				successCount += items.length; // Count all rows as success
			} catch (error: any) {
				items.forEach(item => {
					errors.push({ row: item.index, error: error.message });
				});
			}
		}

		return {
			total: rows.length,
			success: successCount,
			errors
		};
	}

	/**
	 * Xuất dữ liệu ra Excel
	 * @param filters 
	 */
	async exportExcel(filters: any): Promise<Buffer> {
		const { data } = await this.findList(1, 1000, filters);

		const columns: ExcelColumn[] = [
			{ header: '_id', key: '_id' },
			{ header: 'slug', key: 'slug' },
			{ header: 'lang', key: 'lang' },
			{ header: 'name', key: 'name' },
			{ header: 'description', key: 'description' },
		];

		const excelData: any[] = [];

		data.forEach(category => {
			if (category.translations && category.translations.length > 0) {
				category.translations.forEach(trans => {
					excelData.push({
						_id: category._id,
						slug: category.slug,
						lang: trans.lang,
						name: trans.name,
						description: trans.description
					});
				});
			} else {
				// Fallback if no translations
				excelData.push({
					_id: category._id,
					slug: category.slug,
					lang: '',
					name: '',
					description: ''
				});
			}
		});

		const excelService = new ExcelService();
		return excelService.generateExcel(columns, excelData, 'Categories');
	}
}

export default new CategoryService();