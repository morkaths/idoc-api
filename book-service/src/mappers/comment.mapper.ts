import { createClassTransformerMapper } from "../core/base.mapper";
import { CommentDto } from "../dtos/comment.dto";
import { IComment } from "../models/comment.model";

export const CommentMapper = createClassTransformerMapper<IComment, CommentDto>(CommentDto);