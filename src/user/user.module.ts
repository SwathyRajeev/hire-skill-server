import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Auth } from 'src/auth/entities/auth.entity';
import { Address } from 'src/common/entities/address.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Auth, Address]), AuthModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
