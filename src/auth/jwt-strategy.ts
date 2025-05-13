import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { Repository } from 'typeorm';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { Auth, Role } from './entities/auth.entity';
import { User } from 'src/user/entities/user.entity';
import { Provider } from 'src/provider/entities/provider.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Provider)
    private providerRepository: Repository<Provider>,
    @InjectRepository(Auth) private authRepository: Repository<Auth>,
    @InjectRepository(User) private UserRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload): Promise<Provider | User | Auth> {
    const { userId } = payload;

    const auth = await this.authRepository.findOne({ where: { id: userId } });

    console.log('auth:', auth);
    if (!auth) {
      throw new UnauthorizedException();
    }
    return auth;
    // if (auth?.role === Role.User) {
    //   const user = await this.UserRepository.findOne({ where: { auth } });
    //   console.log('user:', user);

    //   if (!user) {
    //     throw new UnauthorizedException();
    //   }
    //   return user;
    // } else {
    //   const provider = await this.providerRepository.findOne({
    //     where: { auth },
    //   });
    //   console.log('provider:', provider);

    //   if (!provider) {
    //     throw new UnauthorizedException();
    //   }
    //   return provider;
    // }
  }
}
