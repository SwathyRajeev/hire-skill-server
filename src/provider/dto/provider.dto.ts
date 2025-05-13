import {
    IsEnum,
    IsNotEmpty,
    IsOptional,
    ValidateNested,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  import { Role } from 'src/auth/entities/auth.entity';
  
  export enum ProviderType {
    Individual = 'individual',
    Company = 'company',
  }
  
  class AddressDto {
    @IsOptional() streetNo: string;
    @IsOptional() streetName: string;
    @IsOptional() city: string;
    @IsOptional() state: string;
    @IsOptional() postCode: string;
  }
  
  export class CreateProviderDto {
    @IsNotEmpty() username: string;
    @IsNotEmpty() password: string;
  
    @IsEnum(ProviderType)
    providerType: ProviderType;
  
    // Common
    @IsNotEmpty() email: string;
    @IsNotEmpty() mobileNumber: string;
  
    // Individual
    @IsOptional() firstName?: string;
    @IsOptional() lastName?: string;
  
    // Company
    @IsOptional() companyName?: string;
    @IsOptional() phoneNumber?: string;
    @IsOptional() businessTaxNumber?: string;
    @IsOptional() representativeFirstName?: string;
    @IsOptional() representativeLastName?: string;
  
    @ValidateNested()
    @Type(() => AddressDto)
    @IsOptional()
    address?: AddressDto;
  }
  