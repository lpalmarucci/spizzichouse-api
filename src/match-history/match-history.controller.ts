import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { MatchHistoryService } from '@/match-history/match-history.service';
import { User } from '@/user/user.decorator';
import { JwtPayload } from '@/auth/auth.types';

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
}
