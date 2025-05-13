import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Category } from 'src/category/entities/category.entity';
import { User } from 'src/user/entities/user.entity';
import { TaskOffer } from './entities/offer.entity';
import { TaskProgress } from './entities/progress.entity';
import { Auth } from 'src/auth/entities/auth.entity';
import { Provider } from 'src/provider/entities/provider.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Category, User, TaskOffer, TaskProgress, Auth, Provider])],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
