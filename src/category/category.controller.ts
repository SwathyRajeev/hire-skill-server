import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiBody({
    description: 'Category creation details',
    type: CreateCategoryDto,
    examples: {
      example: {
        summary: 'Create Category Example',
        value: {
          name: 'Technology',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The category has been successfully created.',
    type: Category,
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Technology',
      },
    },
  })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all categories' })
  @ApiResponse({
    status: 200,
    description: 'List of all categories.',
    schema: {
      example: [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Technology',
        },
        {
          id: '123e4567-e89b-12d3-a456-426614174001',
          name: 'Health',
        },
      ],
    },
  })
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a category by ID' })
  @ApiParam({ name: 'id', description: 'Category ID', type: String })
  @ApiResponse({
    status: 200,
    description: 'The category details.',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Technology',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found.',
    schema: {
      example: {
        statusCode: 404,
        message: 'Category with ID 123e4567-e89b-12d3-a456-426614174000 not found',
        error: 'Not Found',
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a category by ID' })
  @ApiParam({ name: 'id', description: 'Category ID', type: String })
  @ApiBody({
    description: 'Category update details',
    type: UpdateCategoryDto,
    examples: {
      example: {
        summary: 'Update Category Example',
        value: {
          name: 'Updated Technology',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The category has been successfully updated.',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Updated Technology',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found.',
    schema: {
      example: {
        statusCode: 404,
        message: 'Category with ID 123e4567-e89b-12d3-a456-426614174000 not found',
        error: 'Not Found',
      },
    },
  })
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category by ID' })
  @ApiParam({ name: 'id', description: 'Category ID', type: String })
  @ApiResponse({
    status: 200,
    description: 'The category has been successfully deleted.',
    schema: {
      example: {
        message: 'Category with ID 123e4567-e89b-12d3-a456-426614174000 has been deleted',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found.',
    schema: {
      example: {
        statusCode: 404,
        message: 'Category with ID 123e4567-e89b-12d3-a456-426614174000 not found',
        error: 'Not Found',
      },
    },
  })
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}