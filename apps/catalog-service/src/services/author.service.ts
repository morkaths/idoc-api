import { BaseService } from '@libs/core';
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
    const data = (result.items || []).map((d: any) => this.mapper.toDto(d as IAuthor));
    return { data, pagination: result.pagination };
  }
}

export default new AuthorService();