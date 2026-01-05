import { plainToInstance } from "class-transformer";

export interface BaseMapper<Entity, Dto> {
    toDto(entity: Partial<Entity>): Dto;
    toEntity(dto: Partial<Dto>): Partial<Entity>;
}

export function createClassTransformerMapper<Entity, Dto>(dtoClass: new () => Dto): BaseMapper<Entity, Dto> {
    return {
        toDto(entity: Entity): Dto {
            return plainToInstance(dtoClass, entity, {
                excludeExtraneousValues: true,
                enableImplicitConversion: true,
            });
        },
        toEntity(dto: Partial<Dto>): Partial<Entity> {
            return JSON.parse(JSON.stringify(dto)) as Partial<Entity>;
        }
    };
}
