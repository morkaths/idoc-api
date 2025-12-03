import { BaseService } from "src/core/base.service";
import { AuthorDto } from "src/dtos/author.dto";
import { AuthorMapper } from "src/mappers/author.mapper";
import { IAuthor } from "src/models/author.model";
import AuthorRepository from "src/repositories/author.repository";
import { Pagination } from "src/types";


class AuthorService extends BaseService<IAuthor, AuthorDto> {
    constructor() {
        super(AuthorRepository, AuthorMapper);
    }

    async search(params: { [key: string]: any }): Promise<{ data: AuthorDto[]; pagination: Pagination }> {
        const result = await AuthorRepository.search(params);
        const data = (result.items || []).map((d: any) => this.mapper.toDto(d as IAuthor));
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
}

export default new AuthorService();