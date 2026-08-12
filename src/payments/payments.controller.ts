import { Controller, Post, Body, Headers, UseGuards, BadRequestException } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiHeader } from '@nestjs/swagger';

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('hold')
  @ApiOperation({ summary: 'Hold funds in escrow' })
  @ApiHeader({ name: 'idempotency-key', required: false })
  holdFunds(@Headers('idempotency-key') idempotencyKey: string, @Body('bookingId') bookingId: string) {
    if (!bookingId) throw new BadRequestException('bookingId is required');
    return this.paymentsService.holdFunds(bookingId, idempotencyKey);
  }

  @Post('release')
  @ApiOperation({ summary: 'Release funds from escrow' })
  @ApiHeader({ name: 'idempotency-key', required: false })
  releaseFunds(@Headers('idempotency-key') idempotencyKey: string, @Body('bookingId') bookingId: string) {
    if (!bookingId) throw new BadRequestException('bookingId is required');
    return this.paymentsService.releaseFunds(bookingId, idempotencyKey);
  }

  @Post('refund')
  @ApiOperation({ summary: 'Refund funds' })
  @ApiHeader({ name: 'idempotency-key', required: false })
  refundFunds(@Headers('idempotency-key') idempotencyKey: string, @Body('bookingId') bookingId: string) {
    if (!bookingId) throw new BadRequestException('bookingId is required');
    return this.paymentsService.refundFunds(bookingId, idempotencyKey);
  }
}
