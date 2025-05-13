import { IsNumber, IsString, IsUUID } from "class-validator";

export class CreateOfferDto {
    @IsUUID()
    taskId: string;
  
    @IsNumber()
    rate: number;
  
    @IsString()
    message: string;
  }
  