import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as byCrypt from 'bcrypt';

import { SignInDto } from './dto/sign-in.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Auth, Role } from './entities/auth.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private authRepository: Repository<Auth>,
    private jwtService: JwtService,
  ) {}

  async login(signInDto: SignInDto) {
    const { username, password } = signInDto;

    // Find user by username
    const user = await this.authRepository.findOne({ where: { username } });

    if (!user) {
      throw new UnauthorizedException(
        'Invalid Username / Your account is not active now',
      );
    }

    const isPasswordValid = await this.validatePassword(
      password,
      user.password,
      user.salt,
    );

    if (isPasswordValid) {
      const { id: userId, role } = user;
      return { accessToken: await this.generateToken(userId, role) };
    } else {
      throw new UnauthorizedException('Invalid Password');
    }
  }

  async changePassword(changePasswordDto: ChangePasswordDto) {
    const { username, old_password, new_password } = changePasswordDto;

    // Find user by username
    const user = await this.authRepository.findOne({ where: { username } });

    if (!user) {
      throw new UnauthorizedException(
        'Invalid Username / Your account is not active now',
      );
    }

    const isPasswordValid = await this.validatePassword(
      old_password,
      user.password,
      user.salt,
    );

    if (isPasswordValid) {
      const salt = await byCrypt.genSalt();
      const hashedPassword = await this.hashPassword(new_password, salt);

      const result = await this.authRepository.update(user.id, {
        password: hashedPassword,
        salt,
      });

      if (!result.affected || result.affected <= 0) {
        throw new InternalServerErrorException(
          `Update Failed, Please try again!`,
        );
      }

      return await this.generateToken(user.id, user.role);
    } else {
      throw new UnauthorizedException('Invalid Credentials');
    }
  }

  private async validatePassword(
    password: string,
    userPassword: string,
    userSalt: string,
  ): Promise<boolean> {
    const hash = await byCrypt.hash(password, userSalt);
    return hash === userPassword;
  }

  async generateToken(userId: string, role: Role) {
    const payload: JwtPayload = { userId, role };
    return this.jwtService.sign(payload);
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return byCrypt.hash(password, salt);
  }
}
