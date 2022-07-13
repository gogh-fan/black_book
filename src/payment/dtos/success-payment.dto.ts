import { PickType } from '@nestjs/mapped-types';
import { Payment } from '../entities/payment.entity';

export class SuccessPaymentDto extends PickType(Payment, [
  'transactionId',
  'amount',
]) {}
