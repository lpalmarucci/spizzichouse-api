import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoundDto } from './dto/create-round.dto';
import { UpdateRoundDto } from './dto/update-round.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Round } from '@/round/entities/round.entity';
import { FindOptionsRelations, Repository } from 'typeorm';
import { UserService } from '@/user/user.service';
import { MatchService } from '@/match/match.service';

@Injectable()
export class RoundService {
  constructor(
    @InjectRepository(Round)
    private readonly roundRepository: Repository<Round>,
    private readonly userService: UserService,
    private readonly matchService: MatchService,
  ) {}
  async create(
    matchId: number,
    userId: number,
    roundId: number,
    createRoundDto: CreateRoundDto,
  ) {
    const match = await this.matchService.findOne(matchId, { users: true });
    const user = await this.userService.findOne(userId);

    if (!match.users.find((u) => u.id === user.id)) {
      throw new BadRequestException(
        `The user with id ${userId} was not found among the list of available players for this match`,
      );
    }

    const existingRound = await this.getSpecificRound(roundId, matchId, userId);

    if (existingRound) {
      throw new BadRequestException(
        "There's already a round set for this match and user",
      );
    }

    const round = this.roundRepository.create({
      ...createRoundDto,
      roundId,
      match,
      user,
    });
    return this.roundRepository.save(round);
  }

  async getByMatch(id: number) {
    return this.roundRepository.find({
      where: { match: { id } },
      order: { roundId: 1 },
    });
  }

  getByMatchAndUser(
    matchId: number,
    userId: number,
    relations?: FindOptionsRelations<Round>,
  ) {
    return this.roundRepository.find({
      where: {
        match: { id: matchId },
        user: { id: userId },
      },
      relations,
    });
  }

  getSpecificRound(
    roundId: number,
    matchId: number,
    userId: number,
  ): Promise<Round> {
    const round = this.roundRepository.findOne({
      where: {
        roundId,
        matchId,
        userId,
      },
    });
    if (!round) {
      throw new NotFoundException(
        `Unable to find round number ${roundId} for the match ${matchId} and user ${userId}`,
      );
    }
    return round;
  }

  async findOne(matchId: number, userId: number, roundId: number) {
    const user = await this.userService.findOne(userId);
    const match = await this.matchService.findOne(matchId);
    const round = await this.roundRepository.findOne({
      where: {
        user,
        match,
        roundId,
      },
    });
    if (!round)
      throw new NotFoundException(`Round number ${roundId} not found`);
    return round;
  }

  async update(
    matchId: number,
    userId: number,
    roundId: number,
    updateRoundDto: UpdateRoundDto,
  ) {
    try {
      await this.roundRepository
        .createQueryBuilder()
        .update(Round)
        .set({ points: updateRoundDto.points })
        .where('roundId = :roundId', { roundId })
        .andWhere('userId = :userId', { userId })
        .andWhere('matchId = :matchId', { matchId })
        .execute();
    } catch (error) {
      console.error('Error updating points:', error);
      throw new InternalServerErrorException(error.message);
    }

    return this.getSpecificRound(roundId, matchId, userId);
  }

  async deleteRoundForMatchAndUser(
    matchId: number,
    userId: number,
    roundId: number,
  ) {
    const round = await this.getSpecificRound(roundId, matchId, userId);
    return this.roundRepository.remove(round);
  }
}
