import { BookTranslation, IBookTranslation } from "src/models/bookTranslation.model";
import { BaseRepository } from "../core/base.repository";

const BookTransRepository = new BaseRepository<IBookTranslation>(BookTranslation);

export default BookTransRepository;