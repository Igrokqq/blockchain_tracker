import { User } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SignInResponseDto {
  @IsNotEmpty()
  @IsString()
  @Expose()
  access_token: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  refresh_token: string;

  @IsOptional()
  @Expose()
  user?: User;
}
