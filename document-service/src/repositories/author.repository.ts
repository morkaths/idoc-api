import { Author, IAuthor } from "src/models/author.model";
import { BaseRepository } from "../core/base.repository";

class AuthorRepositoryClass extends BaseRepository<IAuthor> {
    constructor() {
        super(Author);
    }
    async search(query: string) {
        const regex = new RegExp(query, "i");
        return Author.find({ 
            name: regex, 
            nationality: regex
        });
    }
}

const AuthorRepository = new AuthorRepositoryClass();

export default AuthorRepository;