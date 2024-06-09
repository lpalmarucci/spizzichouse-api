import { Injectable } from '@nestjs/common';
import { MatchHistoryService } from '@/match-history/match-history.service';
import {
  DashboardRanking,
  DashboardSummaryHistory,
} from '@/dashboard/dto/Dashboard.types';

@Injectable()
export class DashboardService {
  constructor(private readonly _matchHistoryService: MatchHistoryService) {}

  async getRanking(): Promise<DashboardRanking[]> {
    return this._matchHistoryService
      .getRepository()
      .createQueryBuilder('mh')
      .select([
        'COUNT(mh.win) as total_wins',
        'user.username as username',
        'mh.userId as user_id',
      ])
      .innerJoin('mh.user', 'user')
      .where('mh.win = true')
      .groupBy('mh.userId, user.username')
      .orderBy('total_wins', 'DESC')
      .limit(3)
      .getRawMany();
  }

  async getSummary(userId: number) {
    const result = await this._matchHistoryService
      .getRepository()
      .createQueryBuilder('history')
      .select([
        'history.userId',
        'COUNT(CASE WHEN history.win THEN 1 END) AS wins',
        'COUNT(CASE WHEN NOT history.win THEN 1 END) AS loses',
      ])
      .where('history.userId = :userId', { userId })
      .groupBy('history.userId')
      .getRawOne();

    if (!result) {
      return {
        wins: 0,
        loses: 0,
      };
    }

    return {
      wins: Number(result.wins),
      loses: Number(result.loses),
    };
  }

  async getSummaryHistoryMatches(
    userId: number,
    limit: number = 5,
  ): Promise<DashboardSummaryHistory[]> {
    return await this._matchHistoryService
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
