import { Document } from "mongoose";
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

  async create(dto: D): Promise<D | null> {
    const entity = this.mapper.toEntity(dto);
    const createdEntity = await this.repository.create(entity);
    return this.mapper.toDto(createdEntity);
  }

  async update(id: string, dto: D): Promise<D | null> {
    const entity = this.mapper.toEntity(dto);
    const updatedEntity = await this.repository.update(id, entity);
    return updatedEntity ? this.mapper.toDto(updatedEntity) : null;
  }

  async delete(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }
  
}