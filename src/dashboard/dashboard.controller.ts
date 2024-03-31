import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { User } from '@/user/user.decorator';
import { JwtPayload } from '@/auth/auth.types';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  public getSummaryData(
    @User() user: JwtPayload,
    @Query('limit') limit: number,
  ) {
    const take = isNaN(limit) ? 5 : limit;
    return this.dashboardService.getSummary(user.sub, take);
  }

  @Get('ranking')
  ranking(@User() user: JwtPayload) {
    console.log({ user });
    return this.dashboardService.getRanking();
  }
}
