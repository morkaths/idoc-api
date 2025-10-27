import { plainToInstance } from "class-transformer";

export interface BaseMapper<Entity, Dto> {
  toDto(entity: Entity): Dto;
  toEntity(dto: Dto): Entity;
  toDtos(entities: Entity[]): Dto[];
  toEntities(dtos: Dto[]): Entity[];
}

export function createClassTransformerMapper<Entity, Dto>(dtoClass: new () => Dto): BaseMapper<Entity, Dto> {
  return {
    toDto(entity: Entity): Dto {
      return plainToInstance(dtoClass, entity, { excludeExtraneousValues: true }) as Dto;
    },
    toEntity(dto: Dto): Entity {
      return dto as unknown as Entity;
    },
    toDtos(entities: Entity[]): Dto[] {
      return plainToInstance(dtoClass, entities, { excludeExtraneousValues: true }) as Dto[];
    },
    toEntities(dtos: Dto[]): Entity[] {
      return dtos as unknown as Entity[];
    }
  };
}