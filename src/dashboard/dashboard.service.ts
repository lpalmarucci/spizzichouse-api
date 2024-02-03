import { Injectable } from '@nestjs/common';
import { MatchService } from '@/match/match.service';

@Injectable()
export class DashboardService {
  constructor(private readonly _matchService: MatchService) {}

  async getRanking() {}

  async getSummary(userId: number) {
    const usersMatch = await this._matchService.findByUser(userId);
    return usersMatch;
  }
}
