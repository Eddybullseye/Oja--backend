import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateNotificationPreferenceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  channel!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  eventType!: string;

  @ApiProperty()
  @IsBoolean()
  enabled!: boolean;
}

export class ReportUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  reason!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  context!: string;
}
