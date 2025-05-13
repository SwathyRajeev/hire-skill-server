import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateUserDto } from './dto/user.dto';
import { UserService } from './user.service';

@ApiTags('User') 
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Sign up a new user', description: 'Creates a new user and returns an access token.' })
  @ApiResponse({
    status: 201,
    description: 'User successfully signed up.',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request. Invalid input data.' })
  @ApiBody({
    description: 'Payload for creating a new user',
    type: CreateUserDto,
    examples: {
      example1: {
        summary: 'Valid Input',
        value: {
          username: 'john_doe',
          password: 'securePassword123',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          mobileNumber: '+1234567890',
          address: {
            streetNo: '123',
            streetName: 'Main Street',
            city: 'New York',
            state: 'NY',
            postCode: '10001',
          },
        },
      },
    },
  })
  async signup(@Body() createUserDto: CreateUserDto): Promise<{ accessToken: string }> {
    return await this.userService.signup(createUserDto);
  }
}