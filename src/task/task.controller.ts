import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiBody,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/entities/auth.entity';
import { Task, TaskStatus } from './entities/task.entity';
import { RespondOfferDto } from './dto/respond-offer.dto';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { UpdateCompletionDto } from './dto/update-completion.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('Tasks')
@ApiBearerAuth('JWT')
@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @Roles(Role.User)
  @ApiOperation({ summary: 'Create a new task' })
  @ApiBody({
    description: 'Task creation details',
    type: CreateTaskDto,
    examples: {
      example: {
        summary: 'Create Task Example',
        value: {
          taskName: 'Develop a website',
          description: 'Build a responsive website for a client',
          expectedStartDate: '2025-05-15',
          expectedWorkingHours: 40,
          hourlyRate: 50,
          currency: 'USD',
          categoryId: '42fc5524-e74f-4ae7-9856-f9c353501557',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The task has been successfully created.',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174001',
        taskName: 'Develop a website',
        description: 'Build a responsive website for a client',
        expectedStartDate: '2025-05-15',
        expectedWorkingHours: 40,
        hourlyRate: 50,
        currency: 'USD',
        status: 'created',
        category: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Technology',
        },
        user: {
          id: '123e4567-e89b-12d3-a456-426614174002',
          firstName: 'John',
          lastName: 'Doe',
        },
      },
    },
  })
  create(@Body() dto: CreateTaskDto, @Request() req) {
    return this.taskService.create(dto, req.user.userId);
  }

  @Get()
  @Roles(Role.ProviderIndividual, Role.ProviderCompany)
  @ApiOperation({ summary: 'Retrieve all tasks' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: TaskStatus,
    description: 'Filter by task status',
  })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    description: 'Filter by category ID',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all tasks.',
    schema: {
      example: [
        {
          id: '123e4567-e89b-12d3-a456-426614174001',
          taskName: 'Develop a website',
          description: 'Build a responsive website for a client',
          expectedStartDate: '2025-05-15',
          expectedWorkingHours: 40,
          hourlyRate: 50,
          currency: 'USD',
          status: 'created',
          category: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Technology',
          },
          user: {
            id: '123e4567-e89b-12d3-a456-426614174002',
            firstName: 'John',
            lastName: 'Doe',
          },
        },
      ],
    },
  })
  findAll(
    @Query('status') status?: TaskStatus,
    @Query('categoryId') categoryId?: string,
  ) {
    return this.taskService.findAll({ status, categoryId });
  }

  @Get('me')
  @Roles(Role.User)
  @ApiOperation({ summary: 'Retrieve tasks created by the logged-in user' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: TaskStatus,
    description: 'Filter by task status',
  })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    description: 'Filter by category ID',
  })
  @ApiResponse({
    status: 200,
    description: 'List of tasks created by the user.',
    schema: {
      example: [
        {
          id: '123e4567-e89b-12d3-a456-426614174001',
          taskName: 'Develop a website',
          description: 'Build a responsive website for a client',
          expectedStartDate: '2025-05-15',
          expectedWorkingHours: 40,
          hourlyRate: 50,
          currency: 'USD',
          status: 'created',
          category: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Technology',
          },
        },
      ],
    },
  })
  findMine(
    @Request() req,
    @Query('status') status?: TaskStatus,
    @Query('categoryId') categoryId?: string,
  ) {
    return this.taskService.findByUser(req.user.userId, { status, categoryId });
  }

  @Post('offer')
  @Roles(Role.ProviderIndividual, Role.ProviderCompany)
  @ApiOperation({ summary: 'Make an offer for a task' })
  @ApiBody({
    description: 'Details for creating an offer for a task',
    type: CreateOfferDto,
    examples: {
      example: {
        summary: 'Create Offer Example',
        value: {
          taskId: '123e4567-e89b-12d3-a456-426614174001',
          rate: 50,
          message: 'I can complete this task within the given timeframe.',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The offer has been successfully created.',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174003',
        taskId: '123e4567-e89b-12d3-a456-426614174001',
        rate: 50,
        message: 'I can complete this task within the given timeframe.',
        provider: {
          id: '123e4567-e89b-12d3-a456-426614174002',
          name: 'John Doe',
        },
      },
    },
  })
  async makeOffer(@Request() req, @Body() dto: CreateOfferDto) {
    console.log(req.user.id);

    return await this.taskService.makeOffer(dto, req.user.id);
  }

  @Patch('offer/respond')
  @Roles(Role.User)
  @ApiOperation({ summary: 'Respond to an offer for a task' })
  @ApiBody({
    description: 'Details for responding to an offer',
    type: RespondOfferDto,
    examples: {
      example: {
        summary: 'Respond to Offer Example',
        value: {
          offerId: '123e4567-e89b-12d3-a456-426614174003',
          accept: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The offer response has been successfully processed.',
    schema: {
      example: {
        message: 'Offer has been accepted.',
      },
    },
  })
  respondToOffer(@Request() req, @Body() dto: RespondOfferDto) {
    return this.taskService.respondToOffer(dto, req.user.userId);
  }

  @Post('progress')
  @Roles(Role.ProviderIndividual, Role.ProviderCompany)
  @ApiOperation({ summary: 'Add progress updates for a task' })
  @ApiBody({
    description: 'Details for adding progress updates to a task',
    type: UpdateProgressDto,
    examples: {
      example: {
        summary: 'Add Progress Example',
        value: {
          taskId: '123e4567-e89b-12d3-a456-426614174001',
          description: '50% completed',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The progress update has been successfully added.',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174004',
        taskId: '123e4567-e89b-12d3-a456-426614174001',
        description: '50% completed',
        timestamp: '2025-05-15T10:00:00Z',
      },
    },
  })
  addProgress(@Request() req, @Body() dto: UpdateProgressDto) {
    return this.taskService.addProgress(dto, req.user.userId);
  }

  @Patch('complete')
  @Roles(Role.ProviderIndividual, Role.ProviderCompany)
  @ApiOperation({ summary: 'Mark a task as completed' })
  @ApiBody({
    description: 'Task completion details',
    schema: {
      example: {
        taskId: '123e4567-e89b-12d3-a456-426614174001',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The task has been successfully marked as completed.',
    schema: {
      example: {
        message: 'Task has been marked as completed.',
      },
    },
  })
  markCompleted(@Request() req, @Body('taskId') taskId: string) {
    return this.taskService.markCompleted(taskId, req.user.userId);
  }

  @Patch('completion/respond')
  @Roles(Role.User)
  @ApiOperation({ summary: 'Respond to task completion' })
  @ApiBody({
    description: 'Details for responding to task completion',
    type: UpdateCompletionDto,
    examples: {
      example: {
        summary: 'Respond to Completion Example',
        value: {
          taskId: '123e4567-e89b-12d3-a456-426614174001',
          accept: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description:
      'The task completion response has been successfully processed.',
    schema: {
      example: {
        message: 'Task completion has been accepted.',
      },
    },
  })
  handleCompletion(@Request() req, @Body() dto: UpdateCompletionDto) {
    return this.taskService.handleCompletion(dto, req.user.userId);
  }

  @Get(':taskId/offers')
  @Roles(Role.User)
  @ApiOperation({ summary: 'Retrieve all offers for a specific task' })
  @ApiParam({
    name: 'taskId',
    description: 'The ID of the task for which offers are to be retrieved',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'List of all offers for the specified task.',
    schema: {
      example: [
        {
          id: '123e4567-e89b-12d3-a456-426614174003',
          taskId: '123e4567-e89b-12d3-a456-426614174001',
          rate: 50,
          message: 'I can complete this task within the given timeframe.',
          provider: {
            id: '123e4567-e89b-12d3-a456-426614174002',
            name: 'John Doe',
          },
        },
      ],
    },
  })
  async findOffersByTaskId(@Request() req, @Param('taskId') taskId: string) {
    return this.taskService.findOffersByTaskId(taskId, req.user.userId);
  }
}
