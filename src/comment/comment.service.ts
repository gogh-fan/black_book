import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Work } from 'src/work/entities/work.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { UpdateCommentDto } from './dtos/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Work)
    private readonly workRepository: Repository<Work>,
  ) {}

  async create(writerId: number, { content, workId }: CreateCommentDto) {
    if (!content) throw new HttpException('내용은 필수 입니다.', 400);
    if (!workId) throw new HttpException('작업 정보가 올바르지 않습니다.', 400);

    const writer = await this.userRepository.findOne({
      where: { id: writerId },
    });
    if (!writer)
      throw new HttpException('인증정보에 맞는 사용자가 없습니다.', 401);

    const work = await this.workRepository.findOne({ where: { id: workId } });
    if (!work) throw new HttpException('작업 정보가 올바르지 않습니다.', 400);

    await this.commentRepository.save(
      this.commentRepository.create({ content, writer, work }),
    );
  }

  async update(writerId: number, { content, commentId }: UpdateCommentDto) {
    if (!content) throw new HttpException('내용은 필수 입니다.', 400);
    if (!commentId)
      throw new HttpException('댓글 정보가 올바르지 않습니다.', 400);

    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['writer'],
    });
    if (!comment) throw new HttpException('없는 댓글 입니다.', 400);
    comment.content = content;

    const writer = await this.userRepository.findOne({
      where: { id: writerId },
    });
    if (!writer)
      throw new HttpException('사용자 인증 정보가 올바르지 않습니다.', 401);

    if (comment.writerId !== writer.id)
      throw new HttpException('작성자 정보가 일치하지 않습니다.', 401);

    await this.commentRepository.save(comment);
  }

  async delete(writerId: number, commentId: number) {
    if (!commentId)
      throw new HttpException('댓글 번호가 올바르지 않습니다.', 400);

    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['writer'],
    });
    if (!comment) throw new HttpException('없는 댓글 입니다.', 400);

    const writer = await this.userRepository.findOne({
      where: { id: writerId },
    });
    if (!writer)
      throw new HttpException('사용자 인증 정보가 올바르지 않습니다.', 401);

    if (comment.writerId !== writer.id)
      throw new HttpException('작성자 정보가 일치하지 않습니다.', 401);

    await this.commentRepository.delete({ id: commentId });
  }
}
