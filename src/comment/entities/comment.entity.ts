import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/user/entities/user.entity';
import { Work } from 'src/work/entities/work.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';

@Entity()
export class Comment extends CoreEntity {
  @Column()
  @IsString()
  content: string;

  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
  writer: User;
  @RelationId((comment: Comment) => comment.writer)
  writerId: number;

  @ManyToOne(() => Work, (work) => work.comments, { onDelete: 'CASCADE' })
  work: Work;
  @RelationId((comment: Comment) => comment.work)
  workId: number;
}
