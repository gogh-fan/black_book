import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { MailService } from 'src/mail/mail.service';
import { Repository } from 'typeorm';
import { LoginDto } from './dtos/login.dto';
import { SignUpDto } from './dtos/signUp.dto';
import { User } from './entities/user.entity';
import { Verification } from './entities/verification.entity';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { EditDto } from './dtos/edit.dto';
import { DeleteDto } from './dtos/delete.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Verification)
    private readonly verificationRepository: Repository<Verification>,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  async signUp({ nick, password, email }: SignUpDto) {
    if (!nick) throw new HttpException('닉네임은 필수 입니다.', 400);
    if (!password) throw new HttpException('패스워드는 필수 입니다.', 400);
    if (password && password.length < 6)
      throw new HttpException('패스워드는 6자 이상 입니다.', 400);
    if (!email) throw new HttpException('이메일은 필수 입니다.', 400);
    if ((await this.userRepository.findOneBy({ nick }))?.nick === nick)
      throw new HttpException('닉네임이 중복 됩니다.', 400);
    if ((await this.userRepository.findOneBy({ email }))?.email === email)
      throw new HttpException('이메일이 중복 됩니다.', 400);

    const user = await this.userRepository.save(
      this.userRepository.create({ nick, password, email }),
    );
    const verification = await this.verificationRepository.save(
      this.verificationRepository.create({ user }),
    );

    await this.mailService.sendVerificationEmail(user.email, verification.code);

    return { userId: user.id };
  }

  async login(req: Request, { email, password }: LoginDto) {
    if (!email) throw new HttpException('이메일은 필수 입니다.', 400);
    if (!password) throw new HttpException('패스워드는 필수 입니다.', 400);

    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'password'],
    });
    if (!user) throw new HttpException('존재하지 않는 사용자 입니다.', 401);
    const result = await user.comparePassword(password);
    if (!result) throw new HttpException('틀린 비밀번호 입니다.', 401);

    const token = jwt.sign(
      { user_id: user.id },
      this.configService.get('JWT_PRIVATEKEY'),
      {
        algorithm: 'HS256',
        expiresIn: '1d',
      },
    );

    //중복 로그인 방지
    if (req.session && req.session.token) {
      req.sessionStore.destroy(req.sessionID);
      req.session.token = token;
    } else if (req.session) {
      req.session.token = token;
    }

    return { token };
  }

  async edit(userId: number, { password, email }: EditDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user)
      throw new HttpException('존재하지 않는 사용자의 인증 정보 입니다.', 401);

    if (email) {
      user.email = email;
      user.verified = false;
      await this.verificationRepository.delete({ user: { id: user.id } });
      const verification = await this.verificationRepository.save(
        this.verificationRepository.create({ user }),
      );
      await this.mailService.sendVerificationEmail(
        user.email,
        verification.code,
      );
    }
    if (password) user.password = password;

    await this.userRepository.save(user);
  }

  async delete(userId: number, { password }: DeleteDto) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'password'],
    });
    if (!user) throw new HttpException('존재하지 않는 사용자 입니다.', 400);
    const result = await user.comparePassword(password);
    if (!result) throw new HttpException('비밀번호가 다릅니다.', 400);

    await this.userRepository.delete({ id: user.id });
  }

  async resendEmail(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user)
      throw new HttpException('존재하지 않는 사용자의 인증 정보 입니다.', 400);
    if (user.verified) throw new HttpException('인증된 이메일 입니다.', 400);

    await this.verificationRepository.delete({ user: { id: userId } });
    const verification = await this.verificationRepository.save(
      this.verificationRepository.create({ user }),
    );

    await this.mailService.sendVerificationEmail(user.email, verification.code);
  }

  async verifyEmail(code: string) {
    const verification = await this.verificationRepository.findOne({
      where: { code },
      relations: ['user'],
    });
    if (!verification) throw new HttpException('인증 코드가 다릅니다.', 401);

    verification.user.verified = true;
    await this.userRepository.save(verification.user);
  }

  async allNicks() {
    return (await this.userRepository.find()).map((user) => user.nick);
  }
}
