import { BaseService } from '@libs/core';
import { ExcelService, ExcelColumn } from '@libs/excel';
import { AuthorDto } from "../dtos/author.dto";
import { AuthorMapper } from "../mappers/author.mapper";
import { IAuthor } from "../models/author.model";
import { authorRepository } from "../repositories/author.repository";
import { Pagination } from "../types";

class AuthorService extends BaseService<IAuthor, AuthorDto> {
  constructor() {
    super(authorRepository, AuthorMapper);
  }

  /**
   * Lấy danh sách tác giả với phân trang và bộ lọc
   * @param page - Số trang
   * @param limit - Số lượng items mỗi trang
   * @param filter - Bộ lọc
   */
  async findList(page: number, limit: number, filter: { [key: string]: any }): Promise<{ data: AuthorDto[]; pagination: Pagination }> {
    const result = await authorRepository.findList(page, limit, filter);
    const data = (result.items || []).map((d: any) => this.mapper.toDto(d));
    return { data, pagination: result.pagination };
  }

  /**
   * Import dữ liệu tác giả từ file Excel
   * @param buffer - Buffer của file Excel
   */
  async importExcel(buffer: Buffer): Promise<{ total: number; success: number; errors: any[] }> {
    const excelService = new ExcelService();

    interface AuthorRow {
      name: string;
      bio?: string;
      nationality?: string;
      birthDate?: string | Date;
      avatarUrl?: string | { text: string; hyperlink: string };
    }

    const rows = await excelService.readExcel<AuthorRow>(buffer);

    if (!rows || rows.length === 0) {
      throw new Error('File Excel không có dữ liệu');
    }

    const errors: any[] = [];
    const validAuthors: Partial<AuthorDto>[] = [];
    const namesToCheck = new Set<string>();

    // Validate basic data and collect names
    rows.forEach((row, index) => {
      if (!row.name) {
        errors.push({ row: index + 2, error: 'Tên tác giả là bắt buộc' });
        return;
      }
      namesToCheck.add(row.name.trim());
    });

    // Check duplicates using batched queries
    const existingMap = new Set<string>();
    if (namesToCheck.size > 0) {
      const uniqueNames = Array.from(namesToCheck);
      const BATCH_SIZE = 50;

      for (let i = 0; i < uniqueNames.length; i += BATCH_SIZE) {
        const batch = uniqueNames.slice(i, i + BATCH_SIZE);
        const condition = batch.map(name => ({
          name: { $regex: new RegExp(`^${name}$`, 'i') }
        }));

        try {
          const existing = await authorRepository.find({ $or: condition });
          existing.forEach(a => existingMap.add(a.name.toLowerCase()));
        } catch (error) {
          console.error(`Error checking duplicate authors for batch ${i}:`, error);
          // Continue to next batch rather than failing everything, 
          // though strictly we might want to fail if duplicate check fails.
          // For now, log and proceed.
        }
      }
    }

    rows.forEach((row, index) => {
      if (!row.name) return; // Errors handled previously
      const name = row.name.trim();

      if (existingMap.has(name.toLowerCase())) {
        errors.push({ row: index + 2, error: `Tác giả '${name}' đã tồn tại` });
        return;
      }

      const getLinkValue = (val: any): string => {
        if (!val) return '';
        if (typeof val === 'object' && 'text' in val) {
          return val.text;
        }
        return String(val);
      };

      validAuthors.push({
        name: name,
        bio: row.bio,
        nationality: row.nationality,
        birthDate: row.birthDate ? new Date(row.birthDate) : undefined,
        avatarUrl: getLinkValue(row.avatarUrl),
      });
    });

    let successCount = 0;
    if (validAuthors.length > 0) {
      try {
        await this.createMany(validAuthors);
        successCount = validAuthors.length;
      } catch (error: any) {
        throw new Error(`Lỗi khi lưu dữ liệu: ${error.message}`);
      }
    }

    return {
      total: rows.length,
      success: successCount,
      errors
    };
  }

  /**
   * Xuất danh sách tác giả ra Excel
   * @param filters - Bộ lọc
   */
  async exportExcel(filters: any): Promise<Buffer> {
    const { data } = await this.findList(1, 1000, filters);

    const columns: ExcelColumn[] = [
      { header: '_id', key: '_id', width: 25 },
      { header: 'name', key: 'name', width: 30 },
      { header: 'bio', key: 'bio', width: 50 },
      { header: 'nationality', key: 'nationality', width: 20 },
      { header: 'birthDate', key: 'birthDate', width: 15 },
      { header: 'avatarUrl', key: 'avatarUrl', width: 40 },
    ];

    const excelData = data.map(author => ({
      _id: author._id.toString(),
      name: author.name,
      bio: author.bio,
      nationality: author.nationality,
      birthDate: author.birthDate ? new Date(author.birthDate).toISOString().split('T')[0] : '',
      avatarUrl: author.avatarUrl || '',
    }));

    const excelService = new ExcelService();
    return excelService.generateExcel(columns, excelData, 'Danh sách tác giả');
  }
}

export default new AuthorService();