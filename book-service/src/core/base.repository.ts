import { Model, Document, FilterQuery, UpdateQuery } from "mongoose";

export class BaseRepository<T extends Document> {
  private model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  /**
   * Find all documents
   * @returns T[]
   */
  async findAll(): Promise<T[]> {
    return this.model.find().exec();
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
   * Find documents matching the query
   * @param query - FilterQuery<T>
   * @returns T[]
   */
  async find(query: FilterQuery<T>): Promise<T[]> {
    return this.model.find(query).exec();
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
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
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
   * Delete multiple documents matching the query
   * @param query - FilterQuery<T>
   * @returns number of documents deleted
   */
  async deleteMany(query: FilterQuery<T>): Promise<number> {
    const result = await this.model.deleteMany(query).exec();
    return result.deletedCount ?? 0;
  }

}