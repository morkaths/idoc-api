import { Document, FilterQuery } from "mongoose";
import { BaseRepository } from "./base.repository";
import { BaseMapper } from "./base.mapper";

export class BaseService<E extends Document, D> {
  protected repository: BaseRepository<E>;
  protected mapper: BaseMapper<E, D>;

  constructor(repository: BaseRepository<E>, mapper: BaseMapper<E, D>) {
    this.repository = repository;
    this.mapper = mapper;
  }

  async findAll(): Promise<D[]> {
    const entities = await this.repository.findAll();
    return entities.map(entity => this.mapper.toDto(entity));
  }

  async findById(id: string): Promise<D | null> {
    const entity = await this.repository.findById(id);
    return entity ? this.mapper.toDto(entity) : null;
  }

  async find(query: FilterQuery<E>): Promise<D[]> {
    const entities = await this.repository.find(query);
    return entities.map(entity => this.mapper.toDto(entity));
  }

  async findOne(query: FilterQuery<E>): Promise<D | null> {
    const entity = await this.repository.findOne(query);
    return entity ? this.mapper.toDto(entity) : null;
  }

  async create(dto: D): Promise<D> {
    const entity = this.mapper.toEntity(dto);
    const created = await this.repository.create(entity);
    return this.mapper.toDto(created);
  }

  async createMany(dtos: D[]): Promise<D[]> {
    const entities = dtos.map(dto => this.mapper.toEntity(dto));
    const created = await this.repository.createMany(entities);
    return created.map(entity => this.mapper.toDto(entity));
  }

  async update(id: string, dto: Partial<D>): Promise<D | null> {
    const entity = this.mapper.toEntity(dto);
    const updated = await this.repository.update(id, entity);
    return updated ? this.mapper.toDto(updated) : null;
  }

  async findOneAndUpdate(query: FilterQuery<E>, dto: Partial<D>): Promise<D | null> {
    const entity = this.mapper.toEntity(dto);
    const updated = await this.repository.findOneAndUpdate(query, entity);
    return updated ? this.mapper.toDto(updated) : null;
  }

  async updateMany(query: FilterQuery<E>, dto: Partial<D>): Promise<number> {
    const entity = this.mapper.toEntity(dto);
    return await this.repository.updateMany(query, entity);
  }

  async delete(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }

  async findOneAndDelete(query: FilterQuery<E>): Promise<boolean> {
    return await this.repository.findOneAndDelete(query) !== null;
  }

  async deleteMany(query: FilterQuery<E>): Promise<number> {
    return await this.repository.deleteMany(query);
  }

}