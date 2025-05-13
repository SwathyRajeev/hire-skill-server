import { IsBoolean, IsUUID } from "class-validator";

export class UpdateCompletionDto {
    @IsUUID()
    taskId: string;
  
    @IsBoolean()
    accept: boolean;
  }
  