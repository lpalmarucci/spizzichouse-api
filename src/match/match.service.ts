import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from '@/match/entities/match.entity';
import { Equal, FindOptionsRelations, Repository } from 'typeorm';
import { LocationService } from '@/location/location.service';
import { UserService } from '@/user/user.service';
import { User } from '@/user/entities/user.entity';
import { MatchHistoryService } from '@/match-history/match-history.service';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    private readonly locationService: LocationService,
    private readonly userService: UserService,
    @Inject(forwardRef(() => MatchHistoryService))
    private readonly _matchHistoryService: MatchHistoryService,
  ) {}
  async create(createMatchDto: CreateMatchDto) {
    const location =
      createMatchDto.locationId &&
      (await this.locationService.findOne(createMatchDto.locationId));

    const users =
      createMatchDto.userIds &&
      (await Promise.all(
        createMatchDto.userIds.map((id) => this.userService.findOne(id)),
      ));

    const match = this.matchRepository.create({
      ...createMatchDto,
      location,
      users,
    });
    return this.matchRepository.save(match);
  }

  findAll(relations?: FindOptionsRelations<Match>) {
    return this.matchRepository.find({ relations });
  }

  async findOne(id: number, relations?: FindOptionsRelations<Match>) {
    const match = await this.matchRepository.findOne({
      where: { id },
      relations,
    });
    if (!match) throw new NotFoundException(`Match ${id} not found`);
    return match;
  }

  async update(id: number, updateMatchDto: UpdateMatchDto) {
    const location =
      updateMatchDto.locationId &&
      (await this.locationService.findOne(updateMatchDto.locationId));
    const match = await this.matchRepository.preload({
      id,
      ...updateMatchDto,
      location,
    });
    if (!match) throw new NotFoundException(`Match ${id} not found`);
    return this.matchRepository.save(match);
  }

  async remove(id: number) {
    const match = await this.findOne(id);
    return this.matchRepository.remove(match);
  }

  async endMatch(id: number, updateMatchDto: UpdateMatchDto) {
    const match = await this.findOne(id, { users: true, rounds: true });
    if (!match.inProgress) {
      throw new BadRequestException('This match is already ended');
    }

    let userDead: { user: User; score: number };

    const usersWithPoints: { userId: number; score: number }[] = [];
    match.users.forEach((user) => {
      const userScore = match.rounds
        .filter((r) => r.userId === user.id)
        .reduce((tot, r) => tot + r.points, 0);

      usersWithPoints.push({ userId: user.id, score: userScore });
      if (!userDead || userScore > userDead.score)
        userDead = { user, score: userScore };
    });

    const winners = usersWithPoints.filter(
      (user) => user.userId !== userDead.user.id,
    );
    const updateWinnersCount = winners.map(
      async (user) =>
        await this._matchHistoryService.create({
          matchId: id,
          userId: user.userId,
          win: true,
          totalScore: user.score,
        }),
    );

    await this._matchHistoryService.create({
      matchId: id,
      userId: userDead.user.id,
      win: false,
      totalScore: userDead.score,
    });

    await Promise.all(updateWinnersCount);

    const newLocation = await this.matchRepository.preload({
      id,
      ...updateMatchDto,
      inProgress: false,
    });
    return this.matchRepository.save(newLocation);
  }

  async findByUser(userId: number) {
    return this.matchRepository.findBy({
      users: {
        id: Equal(userId),
      },
    });
  }
}
