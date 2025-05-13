import { Controller, Post, Body, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { SignInDto } from './dto/sign-in.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiBody({
    type: SignInDto,
    examples: {
      basic: {
        value: {
          username: 'john_doe',
          password: 'securePassword123',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzZDcyNTlkZi1hYjg0LTQxM2YtYTY1Mi04M2FiMDc4Y2Q2MzYiLCJyb2xlIjoidXNlciIsImlhdCI6MTc0NzAzMDMwOSwiZXhwIjoyMTA3MDMwMzA5fQ.5lDci5g7hGzJ0LEYTo1BZeX0tsdLgvsRuUHazr6tHwU',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid username or password',
        error: 'Unauthorized',
      },
    },
  })
  async login(@Body() signInDto: SignInDto) {
    return await this.authService.login(signInDto);
  }

  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard())
  @Patch('change-password')
  @ApiBody({
    type: ChangePasswordDto,
    examples: {
      basic: {
        value: {
          username: 'john_doe',
          old_password: 'myOldPassword',
          new_password: 'myNewPassword',
        },
      },
    },
  })
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    return await this.authService.changePassword(changePasswordDto);
  }
}
