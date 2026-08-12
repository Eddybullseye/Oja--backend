import { Controller, Get, Patch, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateNotificationPreferenceDto, ReportUserDto } from './dto/users.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me/notification-preferences')
  @ApiOperation({ summary: 'Get notification preferences' })
  getNotificationPreferences(@CurrentUser() user: any) {
    return this.usersService.getNotificationPreferences(user.userId);
  }

  @Patch('me/notification-preferences')
  @ApiOperation({ summary: 'Update notification preference' })
  updateNotificationPreference(@CurrentUser() user: any, @Body() dto: UpdateNotificationPreferenceDto) {
    return this.usersService.updateNotificationPreference(user.userId, dto);
  }

  @Post(':id/report')
  @ApiOperation({ summary: 'Report a user' })
  reportUser(@Param('id') reportedUserId: string, @CurrentUser() user: any, @Body() dto: ReportUserDto) {
    return this.usersService.reportUser(user.userId, reportedUserId, dto);
  }

  @Post(':id/block')
  @ApiOperation({ summary: 'Block a user' })
  blockUser(@Param('id') blockedId: string, @CurrentUser() user: any) {
    return this.usersService.blockUser(user.userId, blockedId);
  }

  @Delete(':id/block')
  @ApiOperation({ summary: 'Unblock a user' })
  unblockUser(@Param('id') blockedId: string, @CurrentUser() user: any) {
    return this.usersService.unblockUser(user.userId, blockedId);
  }

  @Get('me/export')
  @ApiOperation({ summary: 'Export user data' })
  exportData(@CurrentUser() user: any) {
    return this.usersService.exportData(user.userId);
  }

  @Patch('me/deactivate')
  @ApiOperation({ summary: 'Deactivate account' })
  deactivateAccount(@CurrentUser() user: any) {
    return this.usersService.deactivate(user.userId);
  }

  @Delete('me')
  @ApiOperation({ summary: 'Delete account permanently' })
  deleteAccount(@CurrentUser() user: any) {
    return this.usersService.deleteAccount(user.userId);
  }
}
