import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BookingsModule } from './bookings/bookings.module';
import { AdminModule } from './admin/admin.module';
import { ChatModule } from './chat/chat.module';
import { ReferralsModule } from './referrals/referrals.module';
import { HealthModule } from './health/health.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    BookingsModule,
    AdminModule,
    ChatModule,
    ReferralsModule,
    HealthModule,
    PaymentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
