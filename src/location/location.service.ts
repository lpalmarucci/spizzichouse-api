import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Location } from '@/location/entities/location.entity';
import { FindOptionsRelations, Repository } from 'typeorm';
import { UserService } from '@/user/user.service';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}
  async create(createLocationDto: CreateLocationDto) {
    const users =
      createLocationDto.userIds &&
      (await Promise.all(
        createLocationDto.userIds.map((id) => this.userService.findOne(id)),
      ));
    const location = this.locationRepository.create({
      ...createLocationDto,
      users,
    });
    return this.locationRepository.save(location);
  }

  findAll() {
    return this.locationRepository.find({
      relations: {
        users: true,
      },
    });
  }

  async findOne(id: number, relations?: FindOptionsRelations<Location>) {
    const location = await this.locationRepository.findOne({
      where: { id },
      relations,
    });
    if (!location) throw new NotFoundException(`Location ${id} not found`);
    return location;
  }

  async update(id: number, updateLocationDto: UpdateLocationDto) {
    const users =
      updateLocationDto.userIds &&
      (await Promise.all(
        updateLocationDto.userIds.map((id) => this.userService.findOne(id)),
      ));
    const location = await this.locationRepository.preload({
      id,
      ...updateLocationDto,
      users,
    });
    if (!location) {
      throw new NotFoundException(`Location ${id} not found`);
    }
    return this.locationRepository.save(location);
  }

  async remove(id: number) {
    const location = await this.findOne(id);
    return this.locationRepository.delete(location);
  }
}
