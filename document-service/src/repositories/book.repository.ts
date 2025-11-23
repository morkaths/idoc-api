import { Types } from "mongoose";
import { Book, IBook } from "src/models/book.model";
import { BaseRepository } from "../core/base.repository";
import * as constants from "src/constants/aggregations/book.aggregation";

class BookRepositoryClass extends BaseRepository<IBook> {
  constructor() {
    super(Book);
  }

  async findAll(lang?: string) {
    return Book.aggregate(constants.BOOKS_WITH_CATEGORY_TRANS_AGGREGATION(lang));
  }


  async findById(id: string, lang?: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ObjectId");
    }
    const result = await Book.aggregate(
      constants.BOOK_WITH_CATEGORY_TRANS_AGGREGATION(lang, { _id: new Types.ObjectId(id) })
    );
    return result[0] ?? null;
  }

  async findByCategory(categoryId: string, lang?: string) {
    if (!Types.ObjectId.isValid(categoryId)) {
      throw new Error("Invalid ObjectId");
    }
    const match = {
      categoryIds: new Types.ObjectId(categoryId)
    };
    return Book.aggregate(constants.BOOK_WITH_CATEGORY_TRANS_AGGREGATION(lang, match));
  }

  async search(query: string, lang?: string) {
    const regex = new RegExp(query, "i");
    const match = {
      $or: [
        { title: regex },
        { slug: regex },
        { description: regex },
        { isbn: regex }
      ]
    };
    return Book.aggregate(constants.BOOK_WITH_CATEGORY_TRANS_AGGREGATION(lang, match));
  }

}

const BookRepository = new BookRepositoryClass();

export default BookRepository;