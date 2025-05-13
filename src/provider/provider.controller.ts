import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';

import { ProviderService } from './provider.service';
import { CreateProviderDto } from './dto/provider.dto';

@ApiTags('Provider')
@Controller('provider')
export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Sign up a new provider' })
  @ApiBody({
    description: 'Provider signup details',
    type: CreateProviderDto,
    examples: {
      individual: {
        summary: 'Individual Provider Signup',
        value: {
          username: 'john_doe',
          password: 'securePassword123',
          providerType: 'individual',
          email: 'johndoe@example.com',
          mobileNumber: '1234567890',
          firstName: 'John',
          lastName: 'Doe',
          address: {
            streetNo: '123',
            streetName: 'Main Street',
            city: 'New York',
            state: 'NY',
            postCode: '10001',
          },
        },
      },
      company: {
        summary: 'Company Provider Signup',
        value: {
          username: 'company_xyz',
          password: 'securePassword123',
          providerType: 'company',
          email: 'contact@companyxyz.com',
          mobileNumber: '9876543210',
          companyName: 'Company XYZ',
          phoneNumber: '1234567890',
          businessTaxNumber: 'TAX123456',
          representativeFirstName: 'Jane',
          representativeLastName: 'Smith',
          address: {
            streetNo: '456',
            streetName: 'Corporate Blvd',
            city: 'Los Angeles',
            state: 'CA',
            postCode: '90001',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The provider has been successfully signed up.',
    schema: {
      example: {
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data.',
    schema: {
      example: {
        statusCode: 400,
        message:
          'Validation failed: email must be an email, password must be longer than or equal to 8 characters',
        error: 'Bad Request',
      },
    },
  })
  async signup(
    @Body() dto: CreateProviderDto,
  ): Promise<{ accessToken: string }> {
    return this.providerService.signup(dto);
  }
}
