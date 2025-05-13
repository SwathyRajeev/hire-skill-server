import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            changePassword: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return an access token when login is successful', async () => {
      const signInDto: SignInDto = {
        username: 'john_doe',
        password: 'securePassword123',
      };
      const result = { accessToken: 'mockAccessToken' };

      jest.spyOn(authService, 'login').mockResolvedValue(result);

      expect(await authController.login(signInDto)).toEqual(result);
      expect(authService.login).toHaveBeenCalledWith(signInDto);
    });
  });
});
