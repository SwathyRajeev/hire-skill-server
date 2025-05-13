// update-skill.dto.ts
import { IsEnum, IsNumber, IsOptional, IsUUID, IsString } from 'class-validator';
import { NatureOfWork } from '../entities/skill.entity';

export class UpdateSkillDto {
  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @IsString()
  @IsOptional()
  experience?: string;

  @IsEnum(NatureOfWork)
  @IsOptional()
  natureOfWork?: NatureOfWork;

  @IsNumber()
  @IsOptional()
  hourlyRate?: number;
}
