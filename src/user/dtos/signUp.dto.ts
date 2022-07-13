import { PartialType, PickType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';

export class SignUpDto extends PartialType(
  PickType(User, ['nick', 'password', 'email']),
) {}
