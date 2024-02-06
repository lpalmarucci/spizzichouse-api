import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchHistory } from '@/match-history/entities/match.history.entity';
import { CreateMatchHistoryDto } from '@/match-history/dto/create-match-history.dto';
import { UserService } from '@/user/user.service';
import { MatchService } from '@/match/match.service';
import { UpdateMatchHistoryDto } from '@/match-history/dto/update-match-history.dto';
import { HistorySummaryDto } from '@/match-history/dto/history-summary.dto';

@Injectable()
export class MatchHistoryService {
  constructor(
    @InjectRepository(MatchHistory)
    private readonly _matchHistoryRepository: Repository<MatchHistory>,
    private readonly _userService: UserService,
    @Inject(forwardRef(() => MatchService))
    private readonly _matchService: MatchService,
  ) {}

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

    const data = matchHistory;

    if (matchHistoryDto.userId) {
      data['user'] = await this._userService.findOne(matchHistoryDto.userId);
    }

    if (matchHistoryDto.matchId) {
      data['match'] = await this._matchService.findOne(matchHistoryDto.matchId);
    }

    const newMatchHistory = await this._matchHistoryRepository.preload({
      ...data,
      ...matchHistoryDto,
    });

    return this._matchHistoryRepository.save(newMatchHistory);
  }

  async deleteByUser(userId: number) {
    const entitiesToDelete = await this.getByUser(userId);
    return this._matchHistoryRepository.remove(entitiesToDelete);
  }

  async deleteByMatch(matchId: number) {
    const entitiesToDelete = await this.getByMatch(matchId);
    return this._matchHistoryRepository.remove(entitiesToDelete);
  }

  async delete(userId: number, matchId: number) {
    const entitiesToDelete = await this.findOne(userId, matchId);
    return this._matchHistoryRepository.remove(entitiesToDelete);
  }

  async getSummary(userId: number): Promise<HistorySummaryDto> {
    const result = await this._matchHistoryRepository
      .createQueryBuilder('history')
      .select([
        'history.userId',
        'COUNT(CASE WHEN history.win = true THEN 1 END) AS wins',
        'COUNT(history.userId) AS played',
      ])
      .where('history.userId = :userId', { userId })
      .groupBy('history.userId')
      .getRawOne();

    return {
      wins: result ? Number(result.wins) : 0,
      played: result ? Number(result.played) : 0,
    };
  }
}
