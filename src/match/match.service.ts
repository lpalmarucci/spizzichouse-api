import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from '@/match/entities/match.entity';
import { FindOptionsRelations, Repository } from 'typeorm';
import { LocationService } from '@/location/location.service';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    private readonly locationService: LocationService,
  ) {}
  async create(createMatchDto: CreateMatchDto) {
    const location =
      createMatchDto.locationId &&
      (await this.locationService.findOne(createMatchDto.locationId));

    const match = this.matchRepository.create({ ...createMatchDto, location });
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
}
