import { Module } from '@nestjs/common';
import { SkillService } from './skill.service';
import { SkillController } from './skill.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Skill } from './entities/skill.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Provider } from 'src/provider/entities/provider.entity';
import { Category } from 'src/category/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Skill,Provider, Category ]), AuthModule],
  controllers: [SkillController],
  providers: [SkillService],
})
export class SkillModule {}
