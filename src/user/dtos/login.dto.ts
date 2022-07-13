import { PartialType, PickType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';

export class LoginDto extends PartialType(
  PickType(User, ['email', 'password']),
) {}
