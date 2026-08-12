import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Operational - Health')
@Controller('health')
export class HealthController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Liveness check' })
  check() {
    return { status: 'ok', message: 'Service is alive' };
  }

  @Get('ready')
  @ApiOperation({ summary: 'Readiness check' })
  async ready() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      // If we had Redis, we'd check it here
      return { status: 'ok', message: 'Service is ready and connected' };
    } catch (_e) {
      throw new ServiceUnavailableException('Database not reachable');
    }
  }
}
