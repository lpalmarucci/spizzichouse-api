import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { User } from '@/user/user.decorator';
import { JwtPayload } from '@/auth/auth.types';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  public getSummaryData(@User() user: JwtPayload) {
    console.log({ user });
    return this.dashboardService.getSummary(user.sub);
  }

  @Get('ranking')
  ranking(@User() user: JwtPayload) {
    console.log({ user });
    return this.dashboardService.getRanking();
  }
}
