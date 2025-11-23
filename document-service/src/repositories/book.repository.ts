import { Types } from "mongoose";
import { Book, IBook } from "src/models/book.model";
import { BaseRepository } from "../core/base.repository";
import * as constants from "src/constants/aggregations/book.aggregation";

class BookRepositoryClass extends BaseRepository<IBook> {
  constructor() {
    super(Book);
  }

  async findAll(lang?: string) {
    return Book.aggregate(constants.BOOK_AGGREGATION(lang));
  }


  async findById(id: string, lang?: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ObjectId");
    }
    const result = await Book.aggregate(
      constants.BOOK_AGGREGATION(lang, { _id: new Types.ObjectId(id) })
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
    return Book.aggregate(constants.BOOK_AGGREGATION(lang, match));
  }

  async search(params: { [key: string]: any }) {
    const { query, lang, ...rest } = params;
    const regex = new RegExp(String(query), "i");
    const conditions: any[] = [];
    if (query) {
      conditions.push({
        $or: [
          { title: regex },
          { description: regex },
          { isbn: regex },
        ],
      });
    }

    Object.entries(rest).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        conditions.push({ [key]: value });
      }
    });

    const match = conditions.length > 0 ? { $and: conditions } : {};

    return await Book.aggregate(constants.BOOK_AGGREGATION(lang, match));
  }

}

const BookRepository = new BookRepositoryClass();

export default BookRepository;