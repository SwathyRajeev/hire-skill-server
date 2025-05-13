import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { TaskStatus } from './entities/task.entity';

// filepath: src/task/task.controller.test.ts

describe('TaskController', () => {
  let controller: TaskController;
  let service: TaskService;

  const mockTaskService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [{ provide: TaskService, useValue: mockTaskService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<TaskController>(TaskController);
    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a task', async () => {
      const dto = { taskName: 'Test Task' };
      const user = { userId: 'user123' };
      const result = { id: 'task123', ...dto };
      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(dto, { user })).toEqual(result);
      expect(service.create).toHaveBeenCalledWith(dto, user.userId);
    });
  });

  describe('findAll', () => {
    it('should retrieve all tasks', async () => {
      const result = [{ id: 'task123', taskName: 'Test Task' }];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toEqual(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findMine', () => {
    it('should retrieve tasks created by the logged-in user', async () => {
      const user = { userId: 'user123' };
      const result = [
        {
          id: 'task123',
          taskName: 'Test Task',
          description: 'Test Desc',
          expectedStartDate: new Date(),
          expectedWorkingHours: 10,
          hourlyRate: 100,
          status: TaskStatus.CREATED,
          userId: 'user123',
          categoryId: 'cat-1',
          offers: [],
          progressUpdates: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest.spyOn(service, 'findByUser').mockResolvedValue(result);

      const response = await controller.findMine({ user });
      expect(response).toEqual(result);
      expect(service.findByUser).toHaveBeenCalledWith(user.userId, {});
    });
  });
});
