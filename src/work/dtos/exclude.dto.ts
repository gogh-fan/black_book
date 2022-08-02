import { PickType } from '@nestjs/mapped-types';
import { Work } from '../entities/work.entity';

export class ExcludeDto extends PickType(Work, ['id']) {
  nick: string;
}
