import { BaseService } from "src/core/base.service";
import { AuthorDto } from "src/dtos/author.dto";
import { AuthorMapper } from "src/mappers/author.mapper";
import { IAuthor } from "src/models/author.model";
import { authorRepository } from "src/repositories/author.repository";
import { Pagination } from "src/types";


class AuthorService extends BaseService<IAuthor, AuthorDto> {
  constructor() {
    super(authorRepository, AuthorMapper);
  }

  async getList(page: number, limit: number, filter: { [key: string]: any }): Promise<{ data: AuthorDto[]; pagination: Pagination }> {
    const result = await authorRepository.findList(page, limit, filter);
    const data = (result.items || []).map((d: any) => this.mapper.toDto(d as IAuthor));
    return { data, pagination: result.pagination };
  }
}

export default new AuthorService();