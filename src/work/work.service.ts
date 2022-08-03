import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/comment/entities/comment.entity';
import { User } from 'src/user/entities/user.entity';
import { ILike, Repository } from 'typeorm';
import { CreateDto } from './dtos/create.dto';
import { ExcludeDto } from './dtos/exclude.dto';
import { InviteDto } from './dtos/invite.dto';
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
    if (isSecret && !client.secretMember) {
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
        comments: [],
        participants: [],
      }),
    );
  }

  async readMyWorks(userId: number) {
    const works = await this.workRepository.find({ relations: ['client'] });
    return works.filter((work) => work.clientId === userId);
  }

  async allWorks(page = 1) {
    const [works, totalCount] = await this.workRepository.findAndCount({
      where: { isSecret: false },
      take: 6,
      skip: (page - 1) * 6,
      order: { id: 'DESC' },
    });

    if (!works.length) return;
    return {
      works,
      totalCount,
      totalPages: Math.ceil(totalCount / 6),
    };
  }

  async allWorksForLogin(page = 1, user?: User) {
    if (user && user.secretMember) {
      const [works, totalCount] = await this.workRepository.findAndCount({
        take: 6,
        skip: (page - 1) * 6,
        order: { id: 'DESC' },
      });

      if (!works.length) return;
      return {
        works,
        totalCount,
        totalPages: Math.ceil(totalCount / 6),
      };
    } else {
      const [works, totalCount] = await this.workRepository.findAndCount({
        where: { isSecret: false },
        take: 6,
        skip: (page - 1) * 6,
        order: { id: 'DESC' },
      });

      if (!works.length) return;
      return {
        works,
        totalCount,
        totalPages: Math.ceil(totalCount / 6),
      };
    }
  }

  async update(
    clientId: number,
    { id, title, description, address, coverImg, isSecret = false }: UpdateDto,
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
    if (!client.secretMember && isSecret) {
      throw new HttpException('비밀멤버가 아닙니다.', 403);
    } else if (isSecret !== undefined) work.isSecret = isSecret;

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

  async myWorks(clientId: number, page = 1) {
    const client = await this.userRepository.findOne({
      where: { id: clientId },
      relations: ['commissions'],
    });
    if (!client)
      throw new HttpException('인증정보에 맞는 사용자가 없습니다.', 401);

    let works = client.commissions;
    const totalCount = works.length;
    works.sort((a, b) => b.id - a.id);
    works = works.slice((page - 1) * 6, page * 6);

    return {
      works,
      totalCount,
      totalPages: Math.ceil(totalCount / 6),
    };
  }

  async myWork(clientId: number, workId: number) {
    const client = await this.userRepository.findOne({
      where: { id: clientId },
    });
    if (!client)
      throw new HttpException('인증정보에 맞는 사용자가 없습니다.', 401);

    const work = await this.workRepository.findOne({
      where: { id: workId },
      relations: ['client', 'participants'],
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

  async participantedWorks(userId: number, page = 1) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['participated'],
    });

    let works = user.participated;
    const totalCount = works.length;
    works.sort((a, b) => b.id - a.id);
    works = works.slice((page - 1) * 6, page * 6);

    return {
      works,
      totalCount,
      totalPages: Math.ceil(totalCount / 6),
    };
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
        const worksByTitle = await this.workRepository.find({
          where: [{ title: ILike(`%${query}%`) }],
          take: 6,
          skip: (page - 1) * 6,
        });
        const worksByDescription = await this.workRepository.find({
          where: [{ description: ILike(`%${query}%`) }],
          take: 6,
          skip: (page - 1) * 6,
        });

        const works = [...worksByTitle, ...worksByDescription].filter(
          (work, index, arr) =>
            index === arr.findIndex((findWork) => findWork.id === work.id),
        );
        works.sort((a, b) => b.id - a.id);
        const totalCount = works.length;
        if (!totalCount) return;

        return { works, totalCount, totalPages: Math.ceil(totalCount / 6) };
      } else {
        const works = await this.workRepository.find({
          take: 6,
          skip: (page - 1) * 6,
          order: { id: 'DESC' },
        });

        if (!works.length) return;

        return {
          works,
          totalCount: works.length,
          totalPages: Math.ceil(works.length / 6),
        };
      }
    } else {
      if (query) {
        const worksByTitle = await this.workRepository.find({
          where: [{ title: ILike(`%${query}%`), isSecret: false }],
          take: 6,
          skip: (page - 1) * 6,
        });
        const worksByDescription = await this.workRepository.find({
          where: [{ description: ILike(`%${query}%`), isSecret: false }],
          take: 6,
          skip: (page - 1) * 6,
        });

        const works = [...worksByTitle, ...worksByDescription].filter(
          (work, index, arr) =>
            index === arr.findIndex((findWork) => findWork.id === work.id),
        );
        works.sort((a, b) => b.id - a.id);
        const totalCount = works.length;
        if (!totalCount) return;

        return { works, totalCount, totalPages: Math.ceil(totalCount / 6) };
      } else {
        const works = await this.workRepository.find({
          where: { isSecret: false },
          take: 6,
          skip: (page - 1) * 6,
          order: { id: 'DESC' },
        });

        if (!works.length) return;

        return {
          works,
          totalCount: works.length,
          totalPages: Math.ceil(works.length / 6),
        };
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
      const work = await this.workRepository.findOne({
        where: { id: workId },
        relations: ['client'],
      });
      if (!work) return;
      return work;
    } else {
      const work = await this.workRepository.findOne({
        where: { id: workId, isSecret: false },
        relations: ['client'],
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

  async inviteToWork({ id: workId, nick }: InviteDto) {
    if (!workId) throw new HttpException('작업 번호가 올바르지 않습니다.', 400);
    if (!nick) throw new HttpException('닉네임은 필수 입니다.', 400);

    const work = await this.workRepository.findOne({
      where: { id: workId },
      relations: ['participants'],
    });
    if (!work) throw new HttpException('없는 작업 입니다.', 400);

    const participant = await this.userRepository.findOne({
      where: { nick },
      relations: ['participated'],
    });
    if (!participant) throw new HttpException('없는 유저 입니다.', 400);
    if (work.participants.includes(participant))
      throw new HttpException('이미 초대된 유저 입니다.', 400);

    participant.participated.push(work);
    await this.userRepository.save(participant);

    work.participants.push(participant);
    await this.workRepository.save(work);
  }

  async excludeFromWork({ id: workId, nick }: ExcludeDto) {
    if (!workId) throw new HttpException('작업 번호가 올바르지 않습니다.', 400);
    if (!nick) throw new HttpException('닉네임은 필수 입니다.', 400);

    const work = await this.workRepository.findOne({
      where: { id: workId },
      relations: ['participants'],
    });
    if (!work) throw new HttpException('없는 작업 입니다.', 400);

    const participant = await this.userRepository.findOne({
      where: { nick },
      relations: ['participated'],
    });
    if (!participant) throw new HttpException('없는 유저 입니다.', 400);

    participant.participated = participant.participated.filter(
      (user) => user.id !== participant.id,
    );
    await this.userRepository.save(participant);

    work.participants = work.participants.filter(
      (p) => p.id !== participant.id,
    );
    await this.workRepository.save(work);
  }
}
