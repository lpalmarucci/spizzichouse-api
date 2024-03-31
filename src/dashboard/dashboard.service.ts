import { Injectable } from '@nestjs/common';
import { MatchHistoryService } from '@/match-history/match-history.service';

@Injectable()
export class DashboardService {
  constructor(private readonly _matchHistoryService: MatchHistoryService) {}

  async getRanking() {}

  async getSummary(userId: number, limit: number = 5) {
    return this._matchHistoryService
      .getRepository()
      .createQueryBuilder('mh')
      .select([
        'mh.win as win',
        'mh.matchId as matchId',
        'mh.totalScore as totalScore',
        'match.totalPoints as totalPoints',
      ])
      .innerJoin('mh.match', 'match')
      .where('mh.userId = :userId', { userId })
      .limit(limit)
      .getRawMany();
  }
}
