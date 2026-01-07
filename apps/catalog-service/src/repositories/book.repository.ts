import { Types } from "mongoose";
import { Book, IBook } from "../models/book.model";
import { BaseRepository } from '@libs/core';
import { aggregateBook } from "../constants/aggregations/book.aggregation";

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
          { slug: regex },
          { description: regex },
          { isbn: regex }
        ],
      });
    }

    Object.entries(rest).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (key === 'categoryIds') {
          const categoryIds = Array.isArray(value) ? value : [value];
          conditions.push({
            categoryIds: { $in: categoryIds.map((id: string) => new Types.ObjectId(id)) }
          });
        }
        else if (key === 'authorIds') {
          const authorIds = Array.isArray(value) ? value : [value];
          conditions.push({
            authorIds: { $in: authorIds.map((id: string) => new Types.ObjectId(id)) }
          });
        } else {
          conditions.push({ [key]: value });
        }
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

  async findByIds(ids: string[], options?: any) {
    if (!ids || ids.length === 0) return [];

    const validIds = ids
      .filter((id) => Types.ObjectId.isValid(id))
      .map((id) => new Types.ObjectId(id));

    if (validIds.length === 0) return [];

    const match = {
      _id: { $in: validIds }
    };

    // Extract lang from options if it exists, assuming options might be the string 'lang' or an object
    const lang = typeof options === 'string' ? options : options?.lang;

    return Book.aggregate(aggregateBook(lang, match));
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