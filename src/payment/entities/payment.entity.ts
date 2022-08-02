import { IsNumber, IsUUID } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Payment extends CoreEntity {
  @Column()
  @IsUUID()
  orderId: string;

  @Column()
  @IsNumber()
  amount: number;

  @ManyToOne(() => User, (user) => user.payments)
  user: User;
}
