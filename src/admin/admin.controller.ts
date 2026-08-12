import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Admin Portal')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin') // Only admins
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get KPIs and overview (Admin)' })
  getOverview() {
    return this.adminService.getOverview();
  }

  @Get('users')
  @ApiOperation({ summary: 'List all users (Admin)' })
  getUsers() {
    return this.adminService.getUsers();
  }

  @Patch('users/:id/role')
  @ApiOperation({ summary: 'Update user role (Admin)' })
  updateUserRole(@Param('id') id: string, @Body('role') role: string) {
    return this.adminService.updateUserRole(id, role);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get transactions (Admin)' })
  getTransactions() {
    return this.adminService.getTransactions();
  }
}
