import { User } from '@prisma/client';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class UserSignInResponseDto {
  @IsNotEmpty()
  @IsString()
  access_token: string;

  @IsNotEmpty()
  @IsString()
  refresh_token: string;

  @IsNotEmpty()
  @ValidateNested()
  user: User;
}
