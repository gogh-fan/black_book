import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/user/entities/user.entity';
import { Payment } from './entities/payment.entity';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, User])],
  controllers: [PaymentController],
  providers: [PaymentService, AuthGuard, ConfigService],
})
export class PaymentModule {}
