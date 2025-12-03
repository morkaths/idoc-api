import { createClassTransformerMapper } from "../core/base.mapper";
import { AuthorDto } from "../dtos/author.dto";
import { IAuthor } from "../models/author.model";

export const AuthorMapper = createClassTransformerMapper<IAuthor, AuthorDto>(AuthorDto);