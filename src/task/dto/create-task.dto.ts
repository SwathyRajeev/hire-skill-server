import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  taskName: string;

  @IsString()
  description: string;

  @IsNotEmpty()
  expectedStartDate: Date;

  @IsNumber()
  expectedWorkingHours: number;

  @IsNumber()
  hourlyRate: number;

  @IsEnum(['USD', 'AUD', 'SGD', 'INR'])
  currency: 'USD' | 'AUD' | 'SGD' | 'INR';

  @IsNotEmpty()
  categoryId: string;
}
