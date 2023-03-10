import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLocationDto } from './dto/CreateLocation.dto';
import { UpdateLocationDto } from './dto/UpdateLocation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UserService } from '../user/user.service';
import { User } from '../user/User.entity';
import { MatchService } from '../match/match.service';
import { Match } from '../match/entities/match.entity';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly houseRepository: Repository<Location>,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    @Inject(forwardRef(() => MatchService))
    private matchService: MatchService,
  ) {}

  async create(createHouseDto: CreateLocationDto): Promise<Location> {
    const { playerIds, matchIds, ...houseDto } = createHouseDto;
    const newHouseRepo = await this.houseRepository.create(houseDto);
    const newHouse = await this.houseRepository.save(newHouseRepo);
    if (playerIds) {
      this.updateUsers(playerIds, newHouse.locationId);
    }
    if (matchIds) {
      this.updateMatches(matchIds, newHouse.locationId);
    }

    return newHouse;
  }

  findAll(): Promise<Location[]> {
    return this.houseRepository.find({ relations: ['players'] });
  }

  async findOne(id: string): Promise<Location> {
    const house: Location = await this.houseRepository.findOneBy({
      locationId: id,
    });
    if (!house) throw new NotFoundException(`Location ID:${id}  not found`);
    return house;
  }

  async update(
    id: string,
    updateLocationDto: UpdateLocationDto,
  ): Promise<{ affected: UpdateResult['affected'] }> {
    const { playerIds, matchIds, ...houseDto } = updateLocationDto;
    if (playerIds) this.updateUsers(playerIds, id);
    if (matchIds) this.updateMatches(matchIds, id);
    const { affected }: UpdateResult = await this.houseRepository.update(
      { locationId: id },
      updateLocationDto,
    );
    return { affected };
  }

  async remove(id: string): Promise<Omit<DeleteResult, 'raw'>> {
    const result: DeleteResult = await this.houseRepository.delete({
      locationId: id,
    });
    delete result.raw;
    return result;
  }

  async updateUsers(playerIds: string[], locationId: string) {
    await playerIds.forEach((playerId) =>
      this.userService.updateUser(playerId, {
        locationId: locationId,
      }),
    );
  }

  async updateMatches(matchIds: string[], locationId: string) {
    await matchIds.forEach((matchId) =>
      this.matchService.update(matchId, { locationId: locationId }),
    );
  }
}
