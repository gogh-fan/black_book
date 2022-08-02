import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MailService } from 'src/mail/mail.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Verification } from './entities/verification.entity';
import { UserService } from './user.service';
import * as httpMocks from 'node-mocks-http';
import * as jwt from 'jsonwebtoken';

jest.mock('@nestjs/config');
jest.mock('jsonwebtoken', () => {
  return {
    sign: jest.fn(() => 'signedToken'),
  };
});

const mockRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOneBy: jest.fn(),
  findOne: jest.fn(),
});
const mockMailService = () => ({
  sendVerificationEmail: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UserService', () => {
  let userRepository: MockRepository<User>;
  let verificationRepository: MockRepository<Verification>;
  let service: UserService;
  let mailService: MailService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        ConfigService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Verification),
          useValue: mockRepository(),
        },
        {
          provide: MailService,
          useValue: mockMailService(),
        },
      ],
    }).compile();

    userRepository = module.get(getRepositoryToken(User));
    verificationRepository = module.get(getRepositoryToken(Verification));
    service = module.get<UserService>(UserService);
    mailService = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const dto = {
    nick: 'nick',
    email: 'email@email.com',
    password: 'password',
  };
  const user = {
    id: 1,
    nick: 'nick',
    email: 'email@email.com',
    password: 'password',
  };
  const req = httpMocks.createRequest();

  describe('Sign-Up', () => {
    it('에러-닉네임은 필수 입니다.', async () => {
      await service
        .signUp({
          email: dto.email,
          password: dto.password,
        })
        .catch((error) => {
          expect(error.response).toBe('닉네임은 필수 입니다.');
          expect(error.status).toBe(400);
        });
    });
    it('에러-패스워드는 필수 입니다.', async () => {
      await service
        .signUp({ nick: dto.nick, email: dto.email })
        .catch((error) => {
          expect(error.response).toBe('패스워드는 필수 입니다.');
          expect(error.status).toBe(400);
        });
    });
    it('에러-패스워드는 6자 이상 입니다.', async () => {
      await service
        .signUp({ nick: dto.nick, password: 'p', email: dto.email })
        .catch((error) => {
          expect(error.response).toBe('패스워드는 6자 이상 입니다.');
          expect(error.status).toBe(400);
        });
    });
    it('에러-이메일은 필수 입니다.', async () => {
      await service
        .signUp({ nick: dto.nick, password: dto.password })
        .catch((error) => {
          expect(error.response).toBe('이메일은 필수 입니다.');
          expect(error.status).toBe(400);
        });
    });
    it('에러-닉네임이 중복 됩니다.', async () => {
      userRepository.findOneBy.mockResolvedValue(dto);
      await service.signUp(dto).catch((error) => {
        expect(userRepository.findOneBy).toHaveBeenCalledTimes(1);
        expect(userRepository.findOneBy).toHaveBeenCalledWith({
          nick: dto.nick,
        });
        expect(error.response).toBe('닉네임이 중복 됩니다.');
        expect(error.status).toBe(400);
      });
    });
    it('에러-이메일이 중복 됩니다.', async () => {
      userRepository.findOneBy.mockResolvedValue({
        nick: 'otherNick',
        password: dto.password,
        email: dto.email,
      });
      await service.signUp(dto).catch((error) => {
        expect(userRepository.findOneBy).toHaveBeenCalledTimes(2);
        expect(userRepository.findOneBy).toHaveBeenCalledWith({
          email: dto.email,
        });
        expect(error.response).toBe('이메일이 중복 됩니다.');
        expect(error.status).toBe(400);
      });
    });
    it('성공-회원 가입', async () => {
      const verification = { code: 'code' };
      userRepository.findOneBy.mockResolvedValue(null);
      userRepository.create.mockReturnValue(dto);
      userRepository.save.mockResolvedValue(user);
      verificationRepository.create.mockReturnValue(verification);
      verificationRepository.save.mockResolvedValue(verification);

      const result = await service.signUp(dto);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        nick: dto.nick,
      });
      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: dto.email,
      });
      expect(userRepository.findOneBy).toHaveBeenCalledTimes(2);
      expect(userRepository.create).toHaveBeenCalledWith(dto);
      expect(userRepository.create).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledWith(dto);
      expect(userRepository.save).toHaveBeenCalledTimes(1);
      expect(verificationRepository.create).toHaveBeenCalledWith({
        user,
      });
      expect(verificationRepository.create).toHaveBeenCalledTimes(1);
      expect(verificationRepository.save).toHaveBeenCalledWith(verification);
      expect(verificationRepository.save).toHaveBeenCalledTimes(1);
      expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(
        dto.email,
        verification.code,
      );
      expect(mailService.sendVerificationEmail).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ userId: user.id });
    });
  });

  describe('Login', () => {
    it('에러-이메일은 필수 입니다.', async () => {
      await service.login(req, { password: dto.password }).catch((error) => {
        expect(error.response).toBe('이메일은 필수 입니다.');
        expect(error.status).toBe(400);
      });
    });
    it('에러-패스워드는 필수 입니다.', async () => {
      await service.login(req, { email: dto.email }).catch((error) => {
        expect(error.response).toBe('패스워드는 필수 입니다.');
        expect(error.status).toBe(400);
      });
    });
    it('에러-존재하지 않는 사용자 입니다.', async () => {
      userRepository.findOne.mockResolvedValue(null);
      await service
        .login(req, { email: dto.email, password: dto.password })
        .catch((error) => {
          expect(error.response).toBe('존재하지 않는 사용자 입니다.');
          expect(error.status).toBe(401);
        });
    });
    it('에러-틀린 비밀번호 입니다.', async () => {
      userRepository.findOne.mockResolvedValue({
        ...user,
        comparePassword: jest.fn(() => Promise.resolve(false)),
      });
      await service
        .login(req, { email: dto.email, password: dto.password })
        .catch((error) => {
          expect(error.response).toBe('틀린 비밀번호 입니다.');
          expect(error.status).toBe(401);
        });
    });
    it('성공-로그인', async () => {
      userRepository.findOne.mockResolvedValue({
        ...user,
        comparePassword: jest.fn(() => Promise.resolve(true)),
      });

      const result = await service.login(req, {
        email: dto.email,
        password: dto.password,
      });

      expect(jwt.sign).toHaveBeenCalledTimes(1);
      expect(jwt.sign).toHaveBeenCalledWith(
        { user_id: 1 },
        new ConfigService().get('JWT_PRIVATEKEY'),
        {
          algorithm: 'HS256',
          expiresIn: '1d',
        },
      );
      expect(result.token).toBe('signedToken');
    });
  });
});
