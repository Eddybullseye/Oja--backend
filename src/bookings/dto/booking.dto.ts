import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDateString, IsNotEmpty } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  workerId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  serviceId!: string;

  @ApiProperty()
  @IsDateString()
  scheduledDate!: string;

  @ApiProperty()
  @IsNumber()
  price!: number;
}

export class UpdateBookingStatusDto {
  @ApiProperty({ enum: ['pending', 'accepted', 'completed', 'disputed', 'declined'] })
  @IsString()
  @IsNotEmpty()
  status!: string;
}
