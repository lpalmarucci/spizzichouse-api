import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchHistory } from '@/match-history/entities/MatchHistory.entity';
import { CreateMatchHistoryDto } from '@/match-history/dto/create-match-history.dto';
import { UserService } from '@/user/user.service';
import { MatchService } from '@/match/match.service';
import { UpdateMatchHistoryDto } from '@/match-history/dto/update-match-history.dto';
import {
  DashboardRanking,
  MatchHistorySummary,
  SummaryHistoryDetail,
} from '@/match-history/dto/history-summary.dto';

@Injectable()
export class MatchHistoryService {
  constructor(
    @InjectRepository(MatchHistory)
    private readonly _matchHistoryRepository: Repository<MatchHistory>,
    private readonly _userService: UserService,
    @Inject(forwardRef(() => MatchService))
    private readonly _matchService: MatchService,
  ) {}

  getRepository(): Repository<MatchHistory> {
    return this._matchHistoryRepository;
  }

  /**
   * Create a new historic match data
   * @param matchHistoryDto New match history
   */
  async create(matchHistoryDto: CreateMatchHistoryDto) {
    const user = await this._userService.findOne(matchHistoryDto.userId);
    const match = await this._matchService.findOne(matchHistoryDto.matchId);

    const matchHistory = this._matchHistoryRepository.create({
      ...matchHistoryDto,
      user,
      match,
    });

    return this._matchHistoryRepository.save(matchHistory);
  }

  /**
   * Get historic match data by match id
   * @param matchId Id
   * @param options Typeorm find options
   */
  async getByMatch(
    matchId: number,
    options?: Omit<FindManyOptions<MatchHistory>, 'where'>,
  ) {
    return this._matchHistoryRepository.find({
      where: { matchId },
      ...options,
    });
  }

  /**
   * Get historic match data by user id
   * @param userId Id
   * @param options Typeorm find options
   */
  async getByUser(
    userId: number,
    options?: Omit<FindManyOptions<MatchHistory>, 'where'>,
  ) {
    return this._matchHistoryRepository.find({ where: { userId }, ...options });
  }

  /**
   * Get single historic match data
   * @param matchId Match id
   * @param userId User id
   * @param options Typeorm find options
   */
  async findOne(
    userId: number,
    matchId: number,
    options?: Omit<FindManyOptions<MatchHistory>, 'where'>,
  ) {
    return this._matchHistoryRepository.findOne({
      where: { userId, matchId },
      ...options,
    });
  }

  /**
   * Update historic match data
   * @param userId userId
   * @param matchId matchId
   * @param matchHistoryDto new match historic data
   */
  async update(
    userId: number,
    matchId: number,
    matchHistoryDto: UpdateMatchHistoryDto,
  ) {
    const matchHistory = await this.findOne(userId, matchId);

    if (matchHistoryDto.userId) {
      matchHistory['user'] = await this._userService.findOne(
        matchHistoryDto.userId,
      );
    }

    if (matchHistoryDto.matchId) {
      matchHistory['match'] = await this._matchService.findOne(
        matchHistoryDto.matchId,
      );
    }

    const newMatchHistory = await this._matchHistoryRepository.preload({
      ...matchHistory,
      ...matchHistoryDto,
    });

    return this._matchHistoryRepository.save(newMatchHistory);
  }

  /**
   * Delete past matches by user id
   * @param userId
   */
  async deleteByUser(userId: number) {
    const entitiesToDelete = await this.getByUser(userId);
    return this._matchHistoryRepository.remove(entitiesToDelete);
  }

  /**
   * Delete past matches by match id
   * @param matchId
   */
  async deleteByMatch(matchId: number) {
    const entitiesToDelete = await this.getByMatch(matchId);
    return this._matchHistoryRepository.remove(entitiesToDelete);
  }

  /**
   * Delete specific record of the match history table
   * @param userId
   * @param matchId
   */
  async delete(userId: number, matchId: number) {
    const entitiesToDelete = await this.findOne(userId, matchId);
    return this._matchHistoryRepository.remove(entitiesToDelete);
  }

  /**
   * Get the number of wins and loses for a specific user
   * @param userId
   */
  async getSummary(userId: number): Promise<MatchHistorySummary> {
    const result = await this._matchHistoryRepository
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

  /**
   * Get the last stats for N matches for a specific user
   * @param userId Current user id
   * @param limit Number of matches to retrieve (starting from the latest)
   */
  async getDetailedSummary(
    userId: number,
    limit: number = 5,
  ): Promise<SummaryHistoryDetail[]> {
    return await this._matchHistoryRepository
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

  /**
   * Get top 3 player with the highest number of wins
   */
  async getRanking(): Promise<DashboardRanking[]> {
    return this._matchHistoryRepository
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
}
