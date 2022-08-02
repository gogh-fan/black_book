import { PartialType, PickType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';

export class EditDto extends PartialType(
  PickType(User, ['password', 'email']),
) {}
