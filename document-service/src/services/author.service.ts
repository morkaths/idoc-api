import { BaseService } from "src/core/base.service";
import { AuthorDto } from "src/dtos/author.dto";
import { AuthorMapper } from "src/mappers/author.mapper";
import { IAuthor } from "src/models/author.model";
import AuthorRepository from "src/repositories/author.repository";


class AuthorService extends BaseService<IAuthor, AuthorDto> {
    constructor() {
        super(AuthorRepository, AuthorMapper);
    }

    async search(params: { [key: string]: any }): Promise<AuthorDto[]> {
        const { query, ...rest } = params;
        const regex = new RegExp(query, "i");
        const conditions: any[] = [];
        if (query) {
            conditions.push({
                $or: [
                    { name: regex },
                    { nationality: regex }
                ]
            });
        }
        Object.entries(rest).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                conditions.push({ [key]: value });
            }
        });
        const match = conditions.length > 0 ? { $and: conditions } : {};
        return this.find(match);
    }
}

export default new AuthorService();