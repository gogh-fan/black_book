import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http_expception.filter';
import { SuccessInterceptor } from './common/interceptors/success.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    session({
      name: 'black_book.sid',
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new SuccessInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableCors({ origin: true, credentials: true });

  await app.listen(4000);
}
bootstrap();
