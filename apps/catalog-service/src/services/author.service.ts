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

  async findList(page: number, limit: number, filter: { [key: string]: any }): Promise<{ data: AuthorDto[]; pagination: Pagination }> {
    const result = await authorRepository.findList(page, limit, filter);
    const data = (result.items || []).map((d: any) => this.mapper.toDto(d));
    return { data, pagination: result.pagination };
  }

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
      throw new Error('No data found in Excel file');
    }

    const errors: any[] = [];
    const validAuthors: Partial<AuthorDto>[] = [];
    const namesToCheck = new Set<string>();
    
    
    // Helper function
    const getValue = (row: any, key: string) => excelService.getCellValue(row, key);

    // 1. Extraction & Validation
    rows.forEach((row, index) => {
      const name = getValue(row, 'name');
      if (!name) {
        errors.push({ row: index + 2, error: 'Name is required' });
        return;
      }
      namesToCheck.add(name);
    });

    // 2. Bulk Duplicate Check
    const existingMap = new Set<string>();
    if (namesToCheck.size > 0) {
      // Create case-insensitive regex conditions for all names
      const conditions = Array.from(namesToCheck).map(name => ({
        name: { $regex: new RegExp(`^${name}$`, 'i') }
      }));
      
      // Load all matching authors
      const existing = await authorRepository.find({ $or: conditions });
      existing.forEach(a => existingMap.add(a.name.toLowerCase()));
    }

    // 3. Construction
    rows.forEach((row, index) => {
      const name = getValue(row, 'name');
      if (!name) return; // Already handled in validation

      if (existingMap.has(name.toLowerCase())) {
        errors.push({ row: index + 2, error: `Author '${name}' already exists` });
        return;
      }

      validAuthors.push({
        name: name,
        bio: getValue(row, 'bio'),
        nationality: getValue(row, 'nationality'),
        birthDate: getValue(row, 'birth date') ? new Date(getValue(row, 'birth date')) : undefined,
        avatarUrl: getValue(row, 'avatar url'),
      });
    });

    // 4. Bulk Insert
    let successCount = 0;
    if (validAuthors.length > 0) {
      try {
        await this.createMany(validAuthors);
        successCount = validAuthors.length;
      } catch (error: any) {
        throw new Error(`Bulk insert error: ${error.message}`);
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
      { header: 'Name', key: 'name' },
      { header: 'Bio', key: 'bio' },
      { header: 'Nationality', key: 'nationality' },
      { header: 'Birth Date', key: 'birthDate' },
      { header: 'Avatar URL', key: 'avatarUrl' },
    ];

    const excelData = data.map(author => ({
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