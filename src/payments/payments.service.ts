import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async processWithIdempotency(idempotencyKey: string, action: string, bookingId: string, processor: () => Promise<any>) {
    if (!idempotencyKey) {
      return processor();
    }

    try {
      // Attempt to register the idempotency key
      await this.prisma.paymentIdempotency.create({
        data: {
          key: idempotencyKey,
          action,
          bookingId,
        }
      });
      // If it succeeds, run processor
      return await processor();
    } catch (e: any) {
      if (e.code === 'P2002') {
        // Unique constraint failed, meaning idempotency key already exists.
        // Prevent double execution.
        return { message: 'Request already processed (idempotency key matched)', idempotencyKey };
      }
      throw e;
    }
  }

  async holdFunds(bookingId: string, idempotencyKey: string) {
    return this.processWithIdempotency(idempotencyKey, 'hold', bookingId, async () => {
      // Perform hold logic
      await this.prisma.booking.update({
        where: { id: bookingId },
        data: { escrowStatus: 'held' }
      });
      return { message: 'Funds held successfully' };
    });
  }

  async releaseFunds(bookingId: string, idempotencyKey: string) {
    return this.processWithIdempotency(idempotencyKey, 'release', bookingId, async () => {
      // Perform release logic
      await this.prisma.booking.update({
        where: { id: bookingId },
        data: { escrowStatus: 'released' }
      });
      return { message: 'Funds released successfully' };
    });
  }

  async refundFunds(bookingId: string, idempotencyKey: string) {
    return this.processWithIdempotency(idempotencyKey, 'refund', bookingId, async () => {
      // Perform refund logic
      await this.prisma.booking.update({
        where: { id: bookingId },
        data: { escrowStatus: 'refunded' }
      });
      return { message: 'Funds refunded successfully' };
    });
  }
}
