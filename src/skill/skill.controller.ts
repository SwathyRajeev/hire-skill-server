import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SkillService } from './skill.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { Role } from 'src/auth/entities/auth.entity';

import { Roles } from 'src/auth/decorators/roles.decorator';
import { Skill } from './entities/skill.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('Skills')
@Controller('skills')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT')
  @Roles(Role.ProviderIndividual, Role.ProviderCompany)
  @ApiOperation({ summary: 'Create a new skill' })
  @ApiBody({
    description: 'Skill creation details',
    type: CreateSkillDto,
    examples: {
      example: {
        summary: 'Create Skill Example',
        value: {
          experience: '5 years',
          natureOfWork: 'onsite',
          hourlyRate: 50.0,
          categoryId: '42fc5524-e74f-4ae7-9856-f9c353501557',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The skill has been successfully created.',
    type: Skill,
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174001',
        experience: '5 years',
        natureOfWork: 'onsite',
        hourlyRate: 50.0,
        category: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Technology',
        },
        provider: {
          id: '123e4567-e89b-12d3-a456-426614174002',
          name: 'John Doe',
        },
      },
    },
  })
  create(@Body() dto: CreateSkillDto, @Request() req) {
    const providerId = req.user.userId;
    return this.skillService.create(dto, providerId);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all skills' })
  @ApiResponse({
    status: 200,
    description: 'List of all skills.',
    schema: {
      example: [
        {
          id: '123e4567-e89b-12d3-a456-426614174001',
          experience: '5 years',
          natureOfWork: 'onsite',
          hourlyRate: 50.0,
          category: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Technology',
          },
          provider: {
            id: '123e4567-e89b-12d3-a456-426614174002',
            name: 'John Doe',
          },
        },
      ],
    },
  })
  findAll() {
    return this.skillService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a skill by ID' })
  @ApiParam({ name: 'id', description: 'Skill ID', type: String })
  @ApiResponse({
    status: 200,
    description: 'The skill details.',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174001',
        experience: '5 years',
        natureOfWork: 'onsite',
        hourlyRate: 50.0,
        category: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Technology',
        },
        provider: {
          id: '123e4567-e89b-12d3-a456-426614174002',
          name: 'John Doe',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Skill not found.',
    schema: {
      example: {
        statusCode: 404,
        message: 'Skill with ID 123e4567-e89b-12d3-a456-426614174001 not found',
        error: 'Not Found',
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.skillService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT')
  @Roles(Role.ProviderIndividual, Role.ProviderCompany)
  @ApiOperation({ summary: 'Update a skill by ID' })
  @ApiParam({ name: 'id', description: 'Skill ID', type: String })
  @ApiBody({
    description: 'Skill update details',
    type: UpdateSkillDto,
    examples: {
      example: {
        summary: 'Update Skill Example',
        value: {
          experience: '6 years',
          natureOfWork: 'online',
          hourlyRate: 60.0,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The skill has been successfully updated.',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174001',
        experience: '6 years',
        natureOfWork: 'online',
        hourlyRate: 60.0,
        category: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Technology',
        },
        provider: {
          id: '123e4567-e89b-12d3-a456-426614174002',
          name: 'John Doe',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Skill not found.',
    schema: {
      example: {
        statusCode: 404,
        message: 'Skill with ID 123e4567-e89b-12d3-a456-426614174001 not found',
        error: 'Not Found',
      },
    },
  })
  update(@Param('id') id: string, @Body() dto: UpdateSkillDto, @Request() req) {
    const providerId = req.user.userId;
    return this.skillService.update(id, dto, providerId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT')
  @Roles(Role.ProviderIndividual, Role.ProviderCompany)
  @ApiOperation({ summary: 'Delete a skill by ID' })
  @ApiParam({ name: 'id', description: 'Skill ID', type: String })
  @ApiResponse({
    status: 200,
    description: 'The skill has been successfully deleted.',
    schema: {
      example: {
        message:
          'Skill with ID 123e4567-e89b-12d3-a456-426614174001 has been deleted',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Skill not found.',
    schema: {
      example: {
        statusCode: 404,
        message: 'Skill with ID 123e4567-e89b-12d3-a456-426614174001 not found',
        error: 'Not Found',
      },
    },
  })
  remove(@Param('id') id: string, @Request() req) {
    const providerId = req.user.userId;
    return this.skillService.remove(id, providerId);
  }
}
