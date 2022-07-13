import { PickType } from '@nestjs/mapped-types';
import { Comment } from '../entities/comment.entity';

export class CreateCommentDto extends PickType(Comment, ['content']) {
  workId: number;
}
