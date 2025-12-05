import { Types } from "mongoose";
import { Book, IBook } from "src/models/book.model";
import { BaseRepository } from "../core/base.repository";
import { aggregateBook } from "src/constants/aggregations/book.aggregation";

class BookRepository extends BaseRepository<IBook> {
  constructor() {
    super(Book);
  }

  async findList(
    page: number,
    limit: number,
    filter: { [key: string]: any }
  ) {
    const {
      query,
      lang,
      sortBy = 'title',
      sortOrder = 'desc',
      ...rest
    } = filter;

    const p = Math.max(1, Number(page));
    const l = Math.max(1, Number(limit));
    const sortStage = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
    const conditions: any[] = [];

    if (query) {
      const regex = new RegExp(String(query), "i");
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
    const pipeline = [
      ...aggregateBook(lang, match),
      { $sort: sortStage }
    ];

    return this.paginateAggregate(pipeline, p, l);
  }

  async findById(id: string, lang?: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ObjectId");
    }
    const result = await Book.aggregate(
      aggregateBook(lang, { _id: new Types.ObjectId(id) })
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
    return Book.aggregate(aggregateBook(lang, match));
  }

}

export const bookRepository = new BookRepository();