import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(buyerId: string, data: any) {
    return this.prisma.booking.create({
      data: {
        ...data,
        buyerId,
        scheduledDate: new Date(data.scheduledDate),
      },
    });
  }

  async findByBuyer(buyerId: string) {
    return this.prisma.booking.findMany({
      where: { buyerId },
      include: { worker: true, service: true },
    });
  }

  async findByWorker(workerId: string) {
    return this.prisma.booking.findMany({
      where: { workerId },
      include: { buyer: true, service: true },
    });
  }

  async updateStatus(id: string, status: string, userId: string, role: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException('Booking not found');

    if (role === 'buyer' && booking.buyerId !== userId) {
      throw new NotFoundException('Booking not found');
    }
    if (role === 'worker' && booking.workerId !== userId) {
      throw new NotFoundException('Booking not found');
    }

    return this.prisma.booking.update({
      where: { id },
      data: { status },
    });
  }
}
