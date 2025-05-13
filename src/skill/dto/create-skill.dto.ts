import { IsNotEmpty, IsEnum, IsNumber, IsUUID } from 'class-validator';
import { NatureOfWork } from '../entities/skill.entity';

export class CreateSkillDto {
  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @IsNotEmpty()
  experience: string;

  @IsEnum(NatureOfWork)
  natureOfWork: NatureOfWork;

  @IsNumber()
  hourlyRate: number;
}
