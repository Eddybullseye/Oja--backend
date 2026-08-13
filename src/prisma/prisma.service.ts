import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    try {
      await this.$connect();
    } catch (error) {
      Logger.warn('Database not connected. Please ensure DATABASE_URL and DIRECT_URL are set in the environment variables.', 'PrismaService');
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
