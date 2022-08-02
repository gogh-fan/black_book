import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { WorkModule } from './work/work.module';
import { PaymentModule } from './payment/payment.module';
import * as Joi from 'joi';
import { Payment } from './payment/entities/payment.entity';
import { Work } from './work/entities/work.entity';
import { User } from './user/entities/user.entity';
import { Verification } from './user/entities/verification.entity';
import { MailerModule } from '@nestjs-modules/mailer';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { CommentModule } from './comment/comment.module';
import { Comment } from './comment/entities/comment.entity';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'test', 'production').required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        EMAIL_USER: Joi.string().required(),
        EMAIL_PASS: Joi.string().required(),
        EMAIL_HOST: Joi.string().required(),
        EMAIL_PORT: Joi.number().required(),
        BASE_URL: Joi.string().required(),
        JWT_PRIVATEKEY: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV === 'dev',
      entities: [User, Verification, Work, Payment, Comment],
    }),
    MailerModule.forRoot({
      transport: {
        service: 'Naver',
        host: process.env.EMAIL_HOST,
        port: +process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      },
    }),
    UserModule,
    WorkModule,
    PaymentModule,
    CommentModule,
    UploadModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
