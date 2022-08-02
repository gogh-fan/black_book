import { PartialType, PickType } from '@nestjs/mapped-types';
import { Work } from '../entities/work.entity';

export class UpdateDto extends PartialType(
  PickType(Work, [
    'id',
    'title',
    'description',
    'address',
    'coverImg',
    'isSecret',
  ]),
) {}
