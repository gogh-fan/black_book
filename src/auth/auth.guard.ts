import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const token: string = req.headers.jwt as string;
    if (!token) throw new HttpException('로그인이 필요한 서비스 입니다.', 402);
    if (token !== req.session.token)
      throw new HttpException('인증 정보가 다릅니다.', 402);

    const decoded = jwt.verify(token, this.configService.get('JWT_PRIVATEKEY'));
    if (!decoded['user_id']) return false;
    const user = await this.userRepository.findOne({
      where: { id: decoded['user_id'] },
    });
    if (!user) return false;

    context.switchToHttp().getRequest().user = user;
    return true;
  }
}
