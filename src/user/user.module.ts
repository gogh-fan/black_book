import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from 'src/auth/auth.guard';
import { MailService } from 'src/mail/mail.service';
import { User } from './entities/user.entity';
import { Verification } from './entities/verification.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Verification])],
  controllers: [UserController],
  providers: [UserService, MailService, ConfigService, AuthGuard],
  exports: [UserService],
})
export class UserModule {}
