import { createClassTransformerMapper } from '@libs/core';
import { CollectionDto } from '../dtos/collection.dto';
import { ICollection } from '../models/collection.model';

export const CollectionMapper = createClassTransformerMapper<ICollection, CollectionDto>(CollectionDto);