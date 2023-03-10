import { UserService } from '../user/user.service';
import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateMatchDto } from './dto/CreateMatch.dto';
import { UpdateMatchDto } from './dto/UpdateMatch.dto';
import { Match } from './entities/match.entity';
import { LocationService } from '../location/location.service';
import { Location } from '../location/entities/location.entity';
import { User } from '../user/User.entity';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    @Inject(forwardRef(() => LocationService))
    private readonly locationService: LocationService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async create(createPlayDto: CreateMatchDto) {
    const { playerIds, locationId, ...newPlayDto } = createPlayDto;
    const location: Location = await this.locationService.findOne(locationId);
    const users: User[] = [];
    await playerIds.forEach((playerId) =>
      this.userService.findById(playerId).then((user) => users.push(user)),
    );
    return this.matchRepository.save({
      ...newPlayDto,
      location,
      players: users,
    });
  }

  findAll(): Promise<Match[]> {
    return this.matchRepository.find();
  }

  async findOne(id: string): Promise<Match> {
    const match: Match = await this.matchRepository.findOneBy({ matchId: id });
    if (!match) throw new NotFoundException(`Match id: ${id} not found`);
    return match;
  }

  async update(
    matchId: string,
    updateMatchDto: UpdateMatchDto,
  ): Promise<Match> {
    const { locationId, playerIds, ...fieldsToUpdate } = updateMatchDto;
    const existingMatch = await this.findOne(matchId);
    const newMatch = await this.matchRepository.create({
      ...existingMatch,
      ...fieldsToUpdate,
    });
    if (locationId) {
      const location: Location = await this.locationService.findOne(locationId);
      newMatch.location = location;
    }
    return this.matchRepository.save(newMatch);
  }

  async remove(id: string): Promise<Omit<DeleteResult, 'raw'>> {
    const { raw, ...result }: DeleteResult = await this.matchRepository.delete({
      matchId: id,
    });
    return result;
  }
}
