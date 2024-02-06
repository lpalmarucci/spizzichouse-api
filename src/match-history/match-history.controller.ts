import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { MatchHistoryService } from '@/match-history/match-history.service';
import { User } from '@/user/user.decorator';
import { JwtPayload } from '@/auth/auth.types';
import { HistorySummaryDto } from '@/match-history/dto/history-summary.dto';

@Controller('history')
export class MatchHistoryController {
  constructor(private readonly _matchHistoryService: MatchHistoryService) {}

  /**
   * Get the last N matches
   * @param user User logged in
   * @param numMatch Number of matches
   */
  @Get('getMatches/:numMatch')
  getLastMatches(
    @User() user: JwtPayload,
    @Param('numMatch') numMatch?: number,
  ) {
    if (!numMatch || isNaN(numMatch))
      throw new BadRequestException('Set the number of match to retrieve');
    return this._matchHistoryService.getByUser(user.sub, {
      select: {
        userId: true,
        matchId: true,
        totalScore: true,
        win: true,
        match: {
          totalPoints: true,
        },
      },
      relations: {
        match: true,
      },
      take: numMatch,
    });
  }

  /**
   * Get summary of the current user
   * @param user User logged in
   */
  @Get('summary')
  getSummary(@User() user: JwtPayload): Promise<HistorySummaryDto> {
    return this._matchHistoryService.getSummary(user.sub);
  }
}
