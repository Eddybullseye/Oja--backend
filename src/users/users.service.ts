import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOneByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async create(data: any): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  async getNotificationPreferences(userId: string) {
    return this.prisma.notificationPreference.findMany({
      where: { userId },
    });
  }

  async updateNotificationPreference(userId: string, data: any) {
    return this.prisma.notificationPreference.upsert({
      where: {
        userId_channel_eventType: {
          userId,
          channel: data.channel,
          eventType: data.eventType,
        }
      },
      update: { enabled: data.enabled },
      create: {
        userId,
        channel: data.channel,
        eventType: data.eventType,
        enabled: data.enabled,
      }
    });
  }

  async reportUser(reporterId: string, reportedUserId: string, data: any) {
    if (reporterId === reportedUserId) throw new BadRequestException('Cannot report yourself');
    return this.prisma.report.create({
      data: {
        reporterId,
        reportedUserId,
        reason: data.reason,
        context: data.context,
      }
    });
  }

  async blockUser(blockerId: string, blockedId: string) {
    if (blockerId === blockedId) throw new BadRequestException('Cannot block yourself');
    return this.prisma.block.upsert({
      where: { blockerId_blockedId: { blockerId, blockedId } },
      update: {},
      create: { blockerId, blockedId },
    });
  }

  async unblockUser(blockerId: string, blockedId: string) {
    await this.prisma.block.delete({
      where: { blockerId_blockedId: { blockerId, blockedId } }
    }).catch(() => null);
    return { message: 'User unblocked' };
  }

  async exportData(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        buyerProfile: true,
        workerProfile: true,
        bookingsAsBuyer: { include: { transactions: true } },
        bookingsAsWorker: { include: { transactions: true } },
        sentMessages: true,
        receivedMessages: true,
      }
    });
    // In a real system, you might generate a signed URL to a CSV/JSON file.
    // For now, return JSON.
    return user;
  }

  async deactivate(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date() }
    });
  }

  async deleteAccount(userId: string) {
    // Hard delete PII, keep relational data? 
    // The instructions say "anonymize or hard-delete PII while preserving transaction/booking records"
    // Let's anonymize the user record since deleting it would break foreign keys unless we set them to cascade or nullable.
    const anonymizedEmail = `deleted_${userId}@anonymized.local`;
    const anonymizedPassword = await bcrypt.hash('deleted', 10);
    
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        email: anonymizedEmail,
        password: anonymizedPassword,
        twoFactorSecret: null,
        twoFactorEnabled: false,
        resetToken: null,
        resetTokenExpires: null,
        deletedAt: new Date(),
      }
    });
    
    // Also clear profiles
    await this.prisma.buyerProfile.deleteMany({ where: { userId } });
    await this.prisma.workerProfile.deleteMany({ where: { userId } });
    await this.prisma.adminProfile.deleteMany({ where: { userId } });

    return { message: 'Account successfully anonymized and deleted' };
  }
}
