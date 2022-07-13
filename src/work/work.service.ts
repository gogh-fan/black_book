import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/comment/entities/comment.entity';
import { User } from 'src/user/entities/user.entity';
import { ILike, Repository } from 'typeorm';
import { CreateDto } from './dtos/create.dto';
import { UpdateDto } from './dtos/update.dto';
import { Work, workStatus } from './entities/work.entity';

@Injectable()
export class WorkService {
  constructor(
    @InjectRepository(Work)
    private readonly workRepository: Repository<Work>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async create(
    clientId: number,
    { title, description, address, coverImg, isSecret }: CreateDto,
  ) {
    const client = await this.userRepository.findOne({
      where: { id: clientId },
    });
    if (!client)
      throw new HttpException('인증정보에 맞는 사용자가 없습니다.', 401);

    if (isSecret) {
      if (!client.secretMember)
        throw new HttpException('비밀회원이 아닙니다.', 403);
    }
    if (!title) throw new HttpException('제목은 필수 입니다.', 400);
    if (!description) throw new HttpException('설명은 필수 입니다.', 400);
    if (!address) address = null;
    if (!coverImg) coverImg = null;

    await this.workRepository.save(
      this.workRepository.create({
        title,
        description,
        address,
        coverImg,
        isSecret,
        state: workStatus.Recruit,
        client,
      }),
    );
  }

  async update(
    clientId: number,
    { title, description, address, coverImg, id }: UpdateDto,
  ) {
    if (!id) throw new HttpException('작업 번호는 필수 입니다.', 400);

    const work = await this.workRepository.findOne({
      where: { id },
      relations: ['client'],
    });
    if (!work) throw new HttpException('없는 작업 입니다.', 400);
    const client = await this.userRepository.findOne({
      where: { id: clientId },
    });
    if (!client)
      throw new HttpException('인증정보에 맞는 사용자가 없습니다.', 401);
    if (client.id !== work.client.id)
      throw new HttpException('작업의 작성자가 아닙니다.', 403);

    if (title) work.title = title;
    if (description) work.description = description;
    if (address) work.address = address;
    if (coverImg) work.coverImg = coverImg;

    await this.workRepository.save(work);
  }

  async delete(clientId: number, workId: number) {
    const client = await this.userRepository.findOne({
      where: { id: clientId },
    });
    if (!client)
      throw new HttpException('인증정보에 맞는 사용자가 없습니다.', 401);
    const work = await this.workRepository.findOne({
      where: { id: workId },
      relations: ['client'],
    });
    if (!work) throw new HttpException('없는 작업 입니다.', 400);
    if (client.id !== work.client.id)
      throw new HttpException('작업의 작성자가 아닙니다.', 403);

    await this.workRepository.delete({ id: workId });
  }

  async allWorks() {
    const works = await this.workRepository.find({
      where: { isSecret: false },
      order: { id: 'DESC' },
    });

    if (!works.length) return;
    return works;
  }

  async myWorks(clientId: number) {
    const client = await this.userRepository.findOne({
      where: { id: clientId },
    });
    if (!client)
      throw new HttpException('인증정보에 맞는 사용자가 없습니다.', 401);

    let works = await this.workRepository.find({
      relations: ['client'],
      order: { id: 'DESC' },
    });
    works = works.filter((w) => w.clientId === client.id);

    if (!works.length) return;
    return works;
  }

  async myWork(clientId: number, workId: number) {
    const client = await this.userRepository.findOne({
      where: { id: clientId },
    });
    if (!client)
      throw new HttpException('인증정보에 맞는 사용자가 없습니다.', 401);

    const work = await this.workRepository.findOne({
      where: { id: workId },
      relations: ['client'],
    });

    if (!work) return;
    if (work.clientId !== client.id)
      throw new HttpException('인증정보에 맞는 사용자가 아닙니다.', 403);
    return work;
  }

  async altState(clientId: number, workId: number, state: string) {
    if (!state) throw new HttpException('작업 상태는 필수 입니다.', 400);
    else state = state[0].toUpperCase() + state.slice(1);

    const states = Object.keys(workStatus);
    if (!states.includes(state))
      throw new HttpException('없는 작업 상태 정보 입니다.', 401);

    const client = await this.userRepository.findOne({
      where: { id: clientId },
    });
    if (!client)
      throw new HttpException('인증정보에 맞는 사용자가 없습니다.', 401);

    const work = await this.workRepository.findOne({
      where: { id: workId },
      relations: ['client'],
    });
    if (!work) throw new HttpException('해당 작업이 없습니다.', 400);
    if (work.clientId !== client.id)
      throw new HttpException('인증정보에 맞는 사용자가 아닙니다.', 403);

    work.state = state as workStatus;
    await this.workRepository.save(work);
  }

  async searchWorks(clientId: number, page = 1, query?: string) {
    if (!page) page = 1;
    const client = await this.userRepository.findOne({
      where: { id: clientId },
    });
    if (!client)
      throw new HttpException('인증정보에 맞는 사용자가 없습니다.', 401);

    if (client.secretMember) {
      if (query) {
        const [works, totalCount] = await this.workRepository.findAndCount({
          where: [
            { title: ILike(`%${query}%`) },
            { description: ILike(`%${query}%`) },
          ],
          take: 6,
          skip: (page - 1) * 6,
          order: { id: 'DESC' },
        });

        if (!works.length) return;

        return { works, totalCount, totalPages: Math.ceil(totalCount / 6) };
      } else {
        const [works, totalCount] = await this.workRepository.findAndCount({
          take: 6,
          skip: (page - 1) * 6,
          order: { id: 'DESC' },
        });

        if (!works.length) return;

        return { works, totalCount, totalPages: Math.ceil(totalCount / 6) };
      }
    } else {
      if (query) {
        const [works, totalCount] = await this.workRepository.findAndCount({
          where: [
            { title: ILike(`%${query}%`), isSecret: false },
            { description: ILike(`%${query}%`), isSecret: false },
          ],
          take: 6,
          skip: (page - 1) * 6,
          order: { id: 'DESC' },
        });

        if (!works.length) return;

        return { works, totalCount, totalPages: Math.ceil(totalCount / 6) };
      } else {
        const [works, totalCount] = await this.workRepository.findAndCount({
          where: { isSecret: false },
          take: 6,
          skip: (page - 1) * 6,
          order: { id: 'DESC' },
        });

        if (!works.length) return;

        return { works, totalCount, totalPages: Math.ceil(totalCount / 6) };
      }
    }
  }

  async findWorkById(clientId: number, workId: number) {
    const client = await this.userRepository.findOne({
      where: { id: clientId },
    });
    if (!client)
      throw new HttpException('인증정보에 맞는 사용자가 없습니다.', 401);

    if (client.secretMember) {
      const work = await this.workRepository.findOne({ where: { id: workId } });
      if (!work) return;
      return work;
    } else {
      const work = await this.workRepository.findOne({
        where: { id: workId, isSecret: false },
        order: { id: 'DESC' },
      });
      if (!work) return;
      return work;
    }
  }

  async commentsOfWork(workId: number) {
    if (!workId) throw new HttpException('작업 정보가 올바르지 않습니다.', 400);

    const work = await this.workRepository.findOne({
      where: { id: workId },
      relations: ['comments'],
    });
    if (!work) throw new HttpException('없는 작업 입니다.', 400);

    return work.comments;
  }
}
