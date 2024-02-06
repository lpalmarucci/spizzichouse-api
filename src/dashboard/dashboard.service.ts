import { Injectable } from '@nestjs/common';
import { MatchHistoryService } from '@/match-history/match-history.service';

@Injectable()
export class DashboardService {
  constructor(private readonly _matchHistoryService: MatchHistoryService) {}

  async getRanking() {}

  async getSummary(userId: number) {
    return this._matchHistoryService.getByUser(userId, {
      take: 5,
    });
  }
}
