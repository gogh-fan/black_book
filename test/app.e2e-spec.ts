import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import * as request from 'supertest';
import { dropDatabase } from 'typeorm-extension';
import * as signUpDto from './data/sign-up.json';

describe('UserModule', () => {
  let app: INestApplication;
  let jwt: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    dropDatabase({ ifExist: true });
  });

  it('/user/signup', async () => {
    const response = await request(app.getHttpServer())
      .post('/user/signup')
      .send(signUpDto);

    expect(response.status).toBe(201);
  });

  it('/user/login', async () => {
    const response = await request(app.getHttpServer())
      .post('/user/login')
      .send({ email: signUpDto.email, password: signUpDto.password });

    jwt = response.body.token;
    expect(response.status).toBe(201);
  });

  it('/user/delete', async () => {
    const response = await request(app.getHttpServer())
      .post('/user/delete')
      .set('jwt', jwt)
      .send({ email: signUpDto.email, password: signUpDto.password });

    expect(response.status).toBe(201);
  });
});
