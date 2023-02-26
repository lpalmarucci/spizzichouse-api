import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLocationDto } from './dto/CreateLocation.dto';
import { UpdateLocationDto } from './dto/UpdateLocation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly houseRepository: Repository<Location>,
  ) {}

  async create(createHouseDto: CreateLocationDto): Promise<Location> {
    const newHouse = await this.houseRepository.create(createHouseDto);
    await this.houseRepository.insert(newHouse).catch((err) => {
      if (err.code === '23505') {
        throw new BadRequestException('House name already taken');
      }
    });
    return newHouse;
  }

  findAll(): Promise<Location[]> {
    return this.houseRepository.find({ loadRelationIds: true });
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
}
