import { Controller, Post, Body, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, UpdateBookingStatusDto } from './dto/booking.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post()
  @Roles('buyer')
  @ApiTags('Buyer Portal')
  @ApiOperation({ summary: 'Create a new booking (Buyer)' })
  create(@CurrentUser() user: any, @Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(user.userId, createBookingDto);
  }

  @Get('buyer')
  @Roles('buyer')
  @ApiTags('Buyer Portal')
  @ApiOperation({ summary: 'Get buyer bookings (Buyer)' })
  getBuyerBookings(@CurrentUser() user: any) {
    return this.bookingsService.findByBuyer(user.userId);
  }

  @Get('worker')
  @Roles('worker')
  @ApiTags('Worker Portal')
  @ApiOperation({ summary: 'Get worker bookings (Worker)' })
  getWorkerBookings(@CurrentUser() user: any) {
    return this.bookingsService.findByWorker(user.userId);
  }

  @Patch(':id/status')
  @Roles('buyer', 'worker')
  @ApiTags('Buyer Portal', 'Worker Portal')
  @ApiOperation({ summary: 'Update booking status' })
  updateStatus(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updateBookingStatusDto: UpdateBookingStatusDto,
  ) {
    return this.bookingsService.updateStatus(id, updateBookingStatusDto.status, user.userId, user.role);
  }
}
