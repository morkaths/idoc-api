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

	async findById(id: string, lang?: string): Promise<CategoryDto | null> {
		const category = await categoryRepository.findById(id, lang);
		if (!category) return null;
		return CategoryMapper.toDto(category, category.translation);
	}

	async create(categoryDto: Partial<CategoryDto>): Promise<CategoryDto> {
		const entity = CategoryMapper.toEntity(categoryDto);
		const category = await categoryRepository.create(entity);
		await this.handleTranslations(category._id as unknown as string, categoryDto.translations);
		return CategoryMapper.toDto(category);
	}

	async createMany(dtos: Partial<CategoryDto>[]): Promise<CategoryDto[]> {
		const results: CategoryDto[] = [];
		for (const dto of dtos) {
			// Gọi create của chính service này để reuse logic handleTranslations
			results.push(await this.create(dto));
		}
		return results;
	}

	async update(id: string, categoryDto: Partial<CategoryDto>): Promise<CategoryDto | null> {
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

    async importExcel(buffer: Buffer): Promise<{ total: number; success: number; errors: any[] }> {
        const excelService = new ExcelService();
        const rows = await excelService.readExcel<any>(buffer);

        if (!rows || rows.length === 0) {
            throw new Error('No data found in Excel file');
        }

        const errors: any[] = [];
        let successCount = 0;

        // Wrapper for case-insensitive lookup
        const getValue = (row: any, key: string) => excelService.getCellValue(row, key);

        // 1. Group rows by Slug
        const groups = new Map<string, any[]>();
        rows.forEach((row, index) => {
            const slug = getValue(row, 'slug');
            if (!slug) {
                errors.push({ row: index + 2, error: 'Slug is required' });
                return;
            }
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
                    lang: getValue(item.row, 'lang') || 'vi',
                    name: getValue(item.row, 'name') || slug,
                    description: getValue(item.row, 'description')
                }));

                const dto: Partial<CategoryDto> = {
                    slug: slug,
                    translations: translations
                };

                await this.create(dto);
                successCount += items.length;
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

	async exportExcel(filters: any): Promise<Buffer> {
		const { data } = await this.findList(1, 1000, filters);

		const columns: ExcelColumn[] = [
			{ header: 'Slug', key: 'slug' },
			{ header: 'Lang', key: 'lang' },
			{ header: 'Name', key: 'name' },
			{ header: 'Description', key: 'description' },
		];

		const excelData: any[] = [];

		data.forEach(category => {
			if (category.translations && category.translations.length > 0) {
				category.translations.forEach(trans => {
					excelData.push({
						slug: category.slug,
						lang: trans.lang,
						name: trans.name,
						description: trans.description
					});
				});
			} else {
				excelData.push({
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