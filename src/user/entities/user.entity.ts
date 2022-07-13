import { IsBoolean, IsEmail, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { Payment } from 'src/payment/entities/payment.entity';
import { Work } from 'src/work/entities/work.entity';
import { Comment } from 'src/comment/entities/comment.entity';

@Entity()
export class User extends CoreEntity {
  @Column({ unique: true })
  @IsString()
  nick: string;

  @Column({ select: false })
  @IsString()
  password: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ default: false })
  @IsBoolean()
  verified: boolean;

  @Column({ default: false })
  @IsBoolean()
  secretMember: boolean;

  @OneToMany(() => Comment, (comment) => comment.writer)
  comments: Comment[];

  @OneToMany(() => Work, (work) => work.client)
  commissions: Work[];

  @ManyToMany(() => Work, (work) => work.participants)
  participated: Work[];

  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (error) {
        throw new InternalServerErrorException();
      }
    }
  }

  async comparePassword(inputPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(inputPassword, this.password);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
