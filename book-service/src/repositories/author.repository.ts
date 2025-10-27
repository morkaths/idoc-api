import { Author, IAuthor } from "src/models/author.model";
import { BaseRepository } from "../core/base.repository";

const AuthorRepository = new BaseRepository<IAuthor>(Author);

export default AuthorRepository;