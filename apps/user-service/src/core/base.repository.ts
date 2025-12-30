import { Model, Document, FilterQuery, UpdateQuery } from "mongoose";
import { Pagination } from "src/types";

export class BaseRepository<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  /**
   * Count documents matching the query
   * @param query - FilterQuery<T>
   * @returns number
   */
  async count(query: FilterQuery<T>): Promise<number> {
    return this.model.countDocuments(query).exec();
  }

  /**
   * Check if a document exists matching the query
   * @param query - FilterQuery<T>
   * @returns boolean
   */
  async exists(query: FilterQuery<T>): Promise<boolean> {
    return (await this.model.exists(query)) !== null;
  }


  /**
   * Find documents matching the query
   * @param query - FilterQuery<T>
   * @returns T[]
   */
  async find(
    query?: FilterQuery<T>,
    options?: {
      limit?: number;
      skip?: number;
      sort?: any;
      lean?: boolean;
      select?: any;
    }
  ): Promise<T[]> {
    const q = query ?? {};
    const findQuery = this.model.find(q);
    if (options?.sort) findQuery.sort(options.sort);
    if (options?.skip !== undefined) findQuery.skip(Number(options.skip));
    if (options?.limit !== undefined) findQuery.limit(Number(options.limit));
    if (options?.select) findQuery.select(options.select);
    if (options?.lean) (findQuery as any).lean();
    return findQuery.exec();
  }

  /**
   * Find a document by its ID
   * @param id - string
   * @returns T | null
   */
  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  /**
   * Find one document matching the query
   * @param query - FilterQuery<T>
   * @returns T | null
   */
  async findOne(query: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(query).exec();
  }

  /**
   * Create a new document
   * @param data - Partial<T>
   * @returns T
   */
  async create(data: Partial<T>): Promise<T> {
    const document = new this.model(data);
    return document.save();
  }

  /**
   * Create multiple documents
   * @param dataArr - Array of Partial<T>
   * @returns T[]
   */
  async createMany(dataArr: Partial<T>[]): Promise<any[]> {
    return this.model.insertMany(dataArr);
  }

  /**
   * Update a document by its ID
   * @param id - string
   * @param data - Partial<T>
   * @returns T | null
   */
  async update(id: string, data: Partial<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true }).exec();
  }

  /**
   * Update one document matching the query
   * @param query - FilterQuery<T>
   * @param data - UpdateQuery<T>
   * @returns T | null
   */
  async findOneAndUpdate(query: FilterQuery<T>, data: UpdateQuery<T>): Promise<T | null> {
    return this.model.findOneAndUpdate(query, { $set: data }, { new: true, runValidators: true }).exec();
  }

  /**
   * Update multiple documents matching the query
   * @param query - FilterQuery<T>
   * @param data - UpdateQuery<T>
   * @returns number of documents updated
   */
  async updateMany(query: FilterQuery<T>, data: UpdateQuery<T>): Promise<number> {
    const result = await this.model.updateMany(query, data).exec();
    return result.modifiedCount ?? 0;
  }

  /**
   * Delete a document by its ID
   * @param id - string
   * @returns boolean - true if deleted, false otherwise
   */
  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return !!result;
  }

  /**
   * Delete one document matching the query
   * @param query - FilterQuery<T>
   * @returns T | null
   */
  async findOneAndDelete(query: FilterQuery<T>): Promise<T | null> {
    return this.model.findOneAndDelete(query).exec();
  }

  /**
   * Delete multiple documents matching the query
   * @param query - FilterQuery<T>
   * @returns number of documents deleted
   */
  async deleteMany(query: FilterQuery<T>): Promise<number> {
    const result = await this.model.deleteMany(query).exec();
    return result.deletedCount ?? 0;
  }

  /**
   * Bulk write operations (update, insert, delete nhiều bản ghi với điều kiện khác nhau)
   * @param operations - Array of bulk operations (updateOne, insertOne, deleteOne, etc.)
   * @returns result of bulkWrite
   */
  async bulkWrite(operations: any[]): Promise<any> {
    return this.model.bulkWrite(operations, { ordered: false });
  }

  async paginate(
    query: FilterQuery<T>,
    options?: {
      page?: number;
      limit?: number;
      sort?: any;
      lean?: boolean;
      select?: any;
    }
  ): Promise<{ items: Partial<T>[]; pagination: Pagination }> {
    const page = Math.max(1, Number(options?.page ?? 1));
    const limit = Math.max(1, Number(options?.limit ?? 10));
    const skip = (page - 1) * limit;
    const sort = options?.sort ?? { createdAt: -1 };

    const findQuery = this.model.find(query).sort(sort).skip(skip).limit(limit);
    if (options?.select) findQuery.select(options.select);
    if (options?.lean) (findQuery as any).lean();

    const [items, total] = await Promise.all([
      (findQuery as any).exec(),
      this.model.countDocuments(query).exec()
    ]);

    const pages = Math.max(1, Math.ceil(total / limit));

    return {
      items,
      pagination: {
        total,
        page,
        limit,
        pages
      }
    };
  }

  async paginateAggregate(
    pipeline: any[], 
    page = 1, 
    limit = 10
  ): Promise<{ items: Partial<any>[]; pagination: Pagination }> {
    const _page = Math.max(1, Number(page));
    const _limit = Math.max(1, Number(limit));
    const skip = (_page - 1) * _limit;

    const facetPipeline = [
      ...pipeline,
      {
        $facet: {
          items: [{ $skip: skip }, { $limit: _limit }],
          totalCount: [{ $count: "count" }]
        }
      },
      {
        $unwind: {
          path: "$totalCount",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          items: 1,
          total: { $ifNull: ["$totalCount.count", 0] }
        }
      }
    ];

    const res = await this.model.aggregate(facetPipeline).allowDiskUse(true).exec();
    const first = Array.isArray(res) && res.length > 0 ? res[0] : { items: [], total: 0 };
    const items = first.items ?? [];
    const total = Number(first.total ?? 0);
    const pages = total === 0 ? 0 : Math.max(1, Math.ceil(total / _limit));

    return {
      items,
      pagination: {
        total,
        page: _page,
        limit: _limit,
        pages
      }
    };
  }

  async aggregate(pipeline: any[], allowDiskUse = true) {
    const agg = this.model.aggregate(pipeline);
    if (allowDiskUse) (agg as any).allowDiskUse(true);
    return agg.exec();
  }

}