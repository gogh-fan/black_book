import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from 'src/auth/auth.guard';
import { Comment } from 'src/comment/entities/comment.entity';
import { User } from 'src/user/entities/user.entity';
import { Work } from './entities/work.entity';
import { WorkController } from './work.controller';
import { WorkService } from './work.service';

@Module({
  imports: [TypeOrmModule.forFeature([Work, User, Comment])],
  controllers: [WorkController],
  providers: [WorkService, AuthGuard],
})
export class WorkModule {}
