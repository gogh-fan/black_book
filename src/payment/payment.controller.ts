import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { SuccessPaymentDto } from './dtos/success-payment.dto';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('success')
  @UseGuards(AuthGuard)
  async successPayment(
    @CurrentUser() user: User,
    @Body() body: SuccessPaymentDto,
  ) {
    return await this.paymentService.successPayment(user.id, body);
  }

  @Get('fail')
  async failPayment(@Req() req: Request) {
    return await this.paymentService.failPayment(req);
  }
}
