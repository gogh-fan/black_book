import { PickType } from '@nestjs/mapped-types';
import { Comment } from '../entities/comment.entity';

export class UpdateCommentDto extends PickType(Comment, ['content']) {
  commentId: number;
}
