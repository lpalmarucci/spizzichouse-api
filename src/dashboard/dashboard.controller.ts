import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { User } from '@/user/user.decorator';
import { JwtPayload } from '@/auth/auth.types';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  public getSummaryData(@User() user: JwtPayload) {
    return this.dashboardService.getSummary(user.sub);
  }

  @Get('summary/history')
  public getSummaryHistoryMatches(
    @User() user: JwtPayload,
    @Query('limit') limit: number,
  ) {
    const newLimit = isNaN(limit) ? 5 : limit;
    return this.dashboardService.getSummaryHistoryMatches(user.sub, newLimit);
  }

  @Get('ranking')
  ranking() {
    return this.dashboardService.getRanking();
  }
}
