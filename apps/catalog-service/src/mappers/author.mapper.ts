import { createClassTransformerMapper } from '@libs/core';
import { AuthorDto } from "../dtos/author.dto";
import { IAuthor } from "../models/author.model";

export const AuthorMapper = createClassTransformerMapper<IAuthor, AuthorDto>(AuthorDto);