import { createClassTransformerMapper } from '@libs/core';
import { BookmarkDto } from '../dtos/bookmark.dto';
import { IBookmark } from '../models/bookmark.model';

export const bookmarkMapper = createClassTransformerMapper<IBookmark, BookmarkDto>(BookmarkDto);
