import { Injectable } from '@nestjs/common';
import { MatchHistoryService } from '@/match-history/match-history.service';
import { DashboardSummaryHistory } from '@/dashboard/dto/Dashboard.types';

@Injectable()
export class DashboardService {
  constructor(private readonly _matchHistoryService: MatchHistoryService) {}

  async getRanking() {
    return this._matchHistoryService
      .getRepository()
      .createQueryBuilder('mh')
      .select(['COUNT(mh.win) as total_wins', 'user.username as username'])
      .innerJoin('mh.user', 'user')
      .where('mh.win = true')
      .groupBy('mh.userId, user.username')
      .orderBy('total_wins', 'DESC')
      .limit(3)
      .getRawMany();
  }

  async getSummary(userId: number) {
    return this._matchHistoryService.getSummary(userId);
  }

  async getSummaryHistoryMatches(
    userId: number,
    limit: number = 5,
  ): Promise<DashboardSummaryHistory[]> {
    return this._matchHistoryService
      .getRepository()
      .createQueryBuilder('mh')
      .select([
        'mh.matchId as match_id',
        'mh.totalScore as score',
        'match.totalPoints as total_points',
      ])
      .innerJoin('mh.match', 'match')
      .where('mh.userId = :userId', { userId })
      .limit(limit)
      .getRawMany();
  }
}
