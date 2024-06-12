import { Controller, Get, Query } from '@nestjs/common';
import { MatchHistoryService } from '@/match-history/match-history.service';
import { User } from '@/user/user.decorator';
import { JwtPayload } from '@/auth/auth.types';

@Controller()
export class MatchHistoryController {
  constructor(private readonly _matchHistoryService: MatchHistoryService) {}

  @Get('history/summary')
  public getSummaryData(@User() user: JwtPayload) {
    return this._matchHistoryService.getSummary(user.sub);
  }

  @Get('history/matches')
  public getDetailedSummary(
    @User() user: JwtPayload,
    @Query('limit') limit: number,
  ) {
    const newLimit = isNaN(limit) ? 5 : limit;
    return this._matchHistoryService.getDetailedSummary(user.sub, newLimit);
  }

  @Get('ranking')
  ranking() {
    return this._matchHistoryService.getRanking();
  }
}
