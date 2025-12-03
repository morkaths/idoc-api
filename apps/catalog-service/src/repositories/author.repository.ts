import { Author, IAuthor } from "src/models/author.model";
import { BaseRepository } from "../core/base.repository";

class AuthorRepositoryClass extends BaseRepository<IAuthor> {
    constructor() {
        super(Author);
    }

    async search(params: { [key: string]: any }) {
        const {
            query,
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            ...rest
        } = params;
        const conditions: any[] = [];

        if (query) {
            const regex = new RegExp(String(query), "i");
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
        const options = {
            page: Number(page),
            limit: Math.max(1, Number(limit)),
            sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 },
            lean: true
        };

        return this.paginate(match, options);
    }
}

const AuthorRepository = new AuthorRepositoryClass();

export default AuthorRepository;