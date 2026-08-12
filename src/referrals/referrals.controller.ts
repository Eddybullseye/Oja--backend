import { Controller, Post, Get, UseGuards } from '@nestjs/common';
import { ReferralsService } from './referrals.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Referrals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('referrals')
export class ReferralsController {
  constructor(private referralsService: ReferralsService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate or get referral code' })
  generateCode(@CurrentUser() user: any) {
    return this.referralsService.generateCode(user.userId);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get my referral stats' })
  getMyReferrals(@CurrentUser() user: any) {
    return this.referralsService.getMyReferrals(user.userId);
  }
}
