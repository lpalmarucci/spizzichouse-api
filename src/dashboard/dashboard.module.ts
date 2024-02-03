import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { UserModule } from '@/user/user.module';
import { MatchModule } from '@/match/match.module';

@Module({
  imports: [UserModule, MatchModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
