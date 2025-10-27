import { Book, IBook } from "src/models/book.model";
import { BaseRepository } from "../core/base.repository";

const BookRepository = new BaseRepository<IBook>(Book);

export default BookRepository;