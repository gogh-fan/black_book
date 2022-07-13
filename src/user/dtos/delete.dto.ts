import { PickType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';

export class DeleteDto extends PickType(User, ['email', 'password']) {}
