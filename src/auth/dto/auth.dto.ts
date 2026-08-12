import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class RegisterDto extends LoginDto {
  @ApiProperty({ enum: ['buyer', 'worker'] })
  @IsEnum(['buyer', 'worker'])
  role!: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  referralCode?: string;
}

export class ForgotPasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  emailOrPhone!: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  newPassword!: string;
}

export class Verify2FADto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code!: string;
}
