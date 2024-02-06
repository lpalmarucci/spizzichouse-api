import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { UserModule } from '@/user/user.module';
import { MatchHistoryModule } from '@/match-history/match-history.module';

@Module({
  imports: [UserModule, MatchHistoryModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
