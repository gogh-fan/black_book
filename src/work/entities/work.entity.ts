import { IsBoolean, IsEnum, IsString } from 'class-validator';
import { Comment } from 'src/comment/entities/comment.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  RelationId,
} from 'typeorm';

export enum workStatus {
  Recruit = 'Recruit',
  Progressing = 'Progressing',
  Finished = 'Finished',
}

@Entity()
export class Work extends CoreEntity {
  @Column()
  @IsString()
  title: string;

  @Column()
  @IsString()
  description: string;

  @Column({ nullable: true })
  @IsString()
  address?: string;

  @Column({ nullable: true })
  @IsString()
  coverImg?: string;

  @Column({ default: false })
  @IsBoolean()
  isSecret: boolean;

  @Column({ type: 'enum', enum: workStatus })
  @IsEnum(workStatus)
  state: workStatus;

  @OneToMany(() => Comment, (comment) => comment.work)
  comments: Comment[];

  @ManyToOne(() => User, (user) => user.commissions, { onDelete: 'CASCADE' })
  client: User;
  @RelationId((work: Work) => work.client)
  clientId: number;

  @ManyToMany(() => User, (user) => user.participated, { onDelete: 'CASCADE' })
  @JoinTable()
  participants: User[];
}
