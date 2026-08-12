import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, IsEnum } from 'class-validator';

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
}
