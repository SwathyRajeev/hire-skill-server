import { IsBoolean, IsUUID } from "class-validator";

export class RespondOfferDto {
    @IsUUID()
    offerId: string;
  
    @IsBoolean()
    accept: boolean;
  }
  