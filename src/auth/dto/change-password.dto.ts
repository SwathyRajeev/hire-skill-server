import { IsNotEmpty, IsString } from "class-validator";

export class ChangePasswordDto {
  @IsString() @IsNotEmpty() username: string;
  @IsString() @IsNotEmpty() old_password: string;
  @IsString() @IsNotEmpty() new_password: string;
}
