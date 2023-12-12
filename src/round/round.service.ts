import { Injectable, NotFoundException } from '@nestjs/common';
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
  async create(matchId: number, createRoundDto: CreateRoundDto) {
    const match = await this.matchService.findOne(matchId);
    const user = await this.userService.findOne(createRoundDto.userId);

    const round = this.roundRepository.create({
      ...createRoundDto,
      match,
      user,
    });
    return this.roundRepository.save(round);
  }

  findAll(relations?: FindOptionsRelations<Round>) {
    return this.roundRepository.find({ relations });
  }

  async findOne(id: number) {
    const round = await this.roundRepository.findOne({ where: { id } });
    if (!round) throw new NotFoundException(`Round ${id} not found`);
    return round;
  }

  async update(id: number, updateRoundDto: UpdateRoundDto) {
    const round = await this.roundRepository.preload({
      id,
      ...updateRoundDto,
    });
    if (!round) throw new NotFoundException(`Round ${id} not found`);
    return this.roundRepository.save(round);
  }

  async remove(id: number) {
    const round = await this.findOne(id);
    await this.roundRepository.remove(round);
    return { id };
  }

  async getByMatchId(matchId: number) {
    const match = await this.matchService.findOne(matchId);
    return this.roundRepository.find({ where: { match } });
  }
}
