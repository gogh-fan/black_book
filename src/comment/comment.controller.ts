import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { UpdateCommentDto } from './dtos/update-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('create')
  @UseGuards(AuthGuard)
  async create(@CurrentUser() user: User, @Body() body: CreateCommentDto) {
    return await this.commentService.create(user.id, body);
  }

  @Get('/:workId')
  @UseGuards(AuthGuard)
  async read(@Param('workId') workId: string) {
    return await this.commentService.read(+workId);
  }

  @Post('update')
  @UseGuards(AuthGuard)
  async update(@CurrentUser() user: User, @Body() body: UpdateCommentDto) {
    return await this.commentService.update(user.id, body);
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard)
  async delete(@CurrentUser() user: User, @Param('id') commentId: string) {
    return await this.commentService.delete(user.id, +commentId);
  }
}
