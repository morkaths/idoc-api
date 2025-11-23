import { Author, IAuthor } from "src/models/author.model";
import { BaseRepository } from "../core/base.repository";

class AuthorRepositoryClass extends BaseRepository<IAuthor> {
    constructor() {
        super(Author);
    }
}

const AuthorRepository = new AuthorRepositoryClass();

export default AuthorRepository;