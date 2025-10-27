import { BaseService } from "../core/base.service";
import { Comment } from "../models/comment.model";
import { IComment } from "../models/comment.model";
import { CommentDto } from "../dtos/comment.dto";
import { CommentMapper } from "../mappers/comment.mapper";
import { BaseRepository } from "../core/base.repository";

const CommentRepository = new BaseRepository<IComment>(Comment);

class CommentService extends BaseService<IComment, CommentDto> {}

export default new CommentService(CommentRepository, CommentMapper);