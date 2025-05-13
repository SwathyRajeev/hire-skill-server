import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { JwtStrategy } from './jwt-strategy';
import { User } from 'src/user/entities/user.entity';
import { Provider } from 'src/provider/entities/provider.entity';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: '8R9SBUCVDXFYGZJ3K4M6P7Q8SATBUDWEXFZH2J3M5N6P7R9SATCVDWEYGZ',
      signOptions: {
        expiresIn: 360000000,
      },
    }),
    TypeOrmModule.forFeature([Auth, User, Provider]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule, AuthService],
})
export class AuthModule {}
