import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config/typeorm.config';
import { UserModule } from './user/user.module';
import { ProviderModule } from './provider/provider.module';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { CategoryModule } from './category/category.module';
import { SkillModule } from './skill/skill.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    AuthModule,
    UserModule,
    ProviderModule,
    CommonModule,
    CategoryModule,
    SkillModule,
    TaskModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
