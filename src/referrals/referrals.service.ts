import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ReferralsService {
  constructor(private prisma: PrismaService) {}

  async generateCode(userId: string) {
    const existing = await this.prisma.referral.findFirst({
      where: { referrerId: userId, referredUserId: null }
    });

    if (existing) {
      return existing;
    }

    const code = uuidv4().substring(0, 8).toUpperCase();
    return this.prisma.referral.create({
      data: {
        referrerId: userId,
        code,
      }
    });
  }

  async getMyReferrals(userId: string) {
    const referrals = await this.prisma.referral.findMany({
      where: { referrerId: userId, referredUserId: { not: null } },
      include: { referredUser: { select: { id: true, email: true, createdAt: true } } }
    });

    const invited = referrals.length;
    const converted = referrals.filter(r => r.status === 'completed').length;
    const rewardsEarned = referrals.filter(r => r.rewardStatus === 'paid').length;

    return {
      invited,
      converted,
      rewardsEarned,
      referrals
    };
  }
}
