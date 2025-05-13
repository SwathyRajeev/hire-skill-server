import { IsString, IsUUID } from "class-validator";

export class UpdateProgressDto {
    @IsUUID()
    taskId: string;
  
    @IsString()
    description: string;
  }
  