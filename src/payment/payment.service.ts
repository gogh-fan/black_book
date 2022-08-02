import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import got from 'got';
import { ConfigService } from '@nestjs/config';
import { SuccessPaymentDto } from './dtos/success-payment.dto';
import { Request } from 'express';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async successPayment(userId: number, { orderId, amount }: SuccessPaymentDto) {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user)
        throw new HttpException('사용자 인증정보가 올바르지 않습니다.', 401);

      await got.post(
        `https://api.tosspayments.com/v1/payments/${this.configService.get(
          'TOSS_SECRETKEY',
        )}`,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              this.configService.get('TOSS_SECRETKEY') + ':',
            ).toString('base64')}`,
            'Content-Type': 'application/json',
          },
          json: {
            orderId,
            amount,
          },
          responseType: 'json',
        },
      );

      await this.paymentRepository.save(
        this.paymentRepository.create({
          orderId,
          user,
          amount,
        }),
      );

      user.secretMember = true;
      await this.userRepository.save(user);
    } catch (error) {
      throw new HttpException(
        error.response?.body?.message,
        error.response?.body?.code,
      );
    }
  }

  async failPayment(req: Request) {
    if (!+req.query.code) throw new HttpException(req.query.message, 500);

    throw new HttpException(req.query.message, +req.query.code);
  }
}
