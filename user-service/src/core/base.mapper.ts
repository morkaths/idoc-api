import { plainToInstance } from "class-transformer";

export interface BaseMapper<Entity, Dto> {
  toDto(entity: Entity): Dto;
  toDto(entity: Partial<Entity>): Partial<Dto>;
  toEntity(dto: Dto): Entity;
  toEntity(dto: Partial<Dto>): Partial<Entity>;
  toDtos(entities: Entity[]): Dto[];
  toEntities(dtos: Dto[]): Entity[];
}

export function createClassTransformerMapper<Entity, Dto>(dtoClass: new () => Dto): BaseMapper<Entity, Dto> {
  function toDto(entity: Entity): Dto;
  function toDto(entity: Partial<Entity>): Partial<Dto>;
  function toDto(entity: Entity | Partial<Entity>): Dto | Partial<Dto> {
    return plainToInstance(dtoClass, entity, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  function toEntity(dto: Dto): Entity;
  function toEntity(dto: Partial<Dto>): Partial<Entity>;
  function toEntity(dto: Dto | Partial<Dto>): Entity | Partial<Entity> {
    return dto as unknown as Entity;
  }

  function toDtos(entities: Entity[]): Dto[] {
    return plainToInstance(dtoClass, entities, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    }) as Dto[];
  }

  function toEntities(dtos: Dto[]): Entity[] {
    return dtos as unknown as Entity[];
  }

  return { toDto, toEntity, toDtos, toEntities };
}