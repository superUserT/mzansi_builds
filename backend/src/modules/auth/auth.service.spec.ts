import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: any;
  let jwtService: any;

  beforeEach(async () => {
    userRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    jwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: 'UserRepository',
          useValue: userRepository,
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      userRepository.findOne.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');

      const newUser = { id: 1, ...registerDto };
      userRepository.create.mockReturnValue(newUser);
      userRepository.save.mockResolvedValue(newUser);
      jwtService.sign.mockReturnValue('jwt_token');

      const result = await service.register(registerDto);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: [
          { email: registerDto.email },
          { username: registerDto.username },
        ],
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);

      expect(result).toEqual({
        user: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          profilePictureUrl: undefined,
        },
        accessToken: 'jwt_token',
      });
    });

    it('should throw ConflictException if user already exists', async () => {
      const registerDto = {
        username: 'existing',
        email: 'existing@example.com',
        password: 'password123',
      };

      userRepository.findOne.mockResolvedValue({ id: 1 });

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
      expect(userRepository.findOne).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should return JWT token on successful login', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const user = {
        id: 1,
        username: 'testuser',
        email: loginDto.email,
        passwordHash: 'hashed_password',
        profilePictureUrl: 'url',
      };

      userRepository.findOne.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.sign.mockReturnValue('jwt_token');

      const result = await service.login(loginDto);

      expect(result).toEqual({
        user: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          profilePictureUrl: 'url',
        },
        accessToken: 'jwt_token',
      });

      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: user.id,
        username: user.username,
      });
    });

    it('should throw UnauthorizedException on invalid password', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'wrong_password',
      };

      const user = {
        id: 1,
        email: loginDto.email,
        passwordHash: 'hashed_password',
      };

      userRepository.findOne.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
