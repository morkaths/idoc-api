import { BaseService } from "src/core/base.service";
import { AuthorDto } from "src/dtos/author.dto";
import { AuthorMapper } from "src/mappers/author.mapper";
import { IAuthor } from "src/models/author.model";
import AuthorRepository from "src/repositories/author.repository";


class AuthorService extends BaseService<IAuthor, AuthorDto> {
    constructor() {
        super(AuthorRepository, AuthorMapper);
    }

    async search(query: string): Promise<AuthorDto[]> {
        const authors = await AuthorRepository.search(query);
        return authors.map(AuthorMapper.toDto);
    }
}

export default new AuthorService();