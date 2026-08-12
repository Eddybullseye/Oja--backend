import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getOverview() {
    const totalUsers = await this.prisma.user.count();
    const totalBookings = await this.prisma.booking.count();
    const completedBookings = await this.prisma.booking.count({ where: { status: 'completed' } });
    
    return {
      totalUsers,
      totalBookings,
      completedBookings,
    };
  }

  async getUsers() {
    return this.prisma.user.findMany({
      include: { buyerProfile: true, workerProfile: true },
    });
  }

  async updateUserRole(id: string, role: string) {
    return this.prisma.user.update({
      where: { id },
      data: { role },
    });
  }

  async getTransactions() {
    return this.prisma.booking.findMany({
      where: { escrowStatus: 'released' },
      select: { id: true, price: true, updatedAt: true, service: true },
    });
  }
}
