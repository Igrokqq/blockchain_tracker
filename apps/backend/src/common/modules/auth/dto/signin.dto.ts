import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class SignInDto {
  @IsOptional()
  @IsString()
  password?: string;

  passwordlessAuth?: boolean;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
