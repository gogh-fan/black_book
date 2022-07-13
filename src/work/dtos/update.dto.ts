import { PartialType, PickType } from '@nestjs/mapped-types';
import { Work } from '../entities/work.entity';

export class UpdateDto extends PartialType(
  PickType(Work, ['title', 'description', 'address', 'coverImg', 'id']),
) {
  workId: number;
}
