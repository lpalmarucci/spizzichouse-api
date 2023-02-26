import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateHouseDto } from './dto/create-house.dto';
import { UpdateHouseDto } from './dto/update-house.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { House } from './entities/house.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class HouseService {
  constructor(
    @InjectRepository(House)
    private readonly houseRepository: Repository<House>,
  ) {}

  async create(createHouseDto: CreateHouseDto): Promise<House> {
    const newHouse = await this.houseRepository.create(createHouseDto);
    await this.houseRepository.insert(newHouse).catch((err) => {
      if (err.code === '23505') {
        throw new BadRequestException('House name already taken');
      }
    });
    return newHouse;
  }

  findAll(): Promise<House[]> {
    return this.houseRepository.find();
  }

  findOne(id: string): Promise<House> {
    return this.houseRepository.findOneBy({
      houseId: id,
    });
  }

  async update(
    id: string,
    updateHouseDto: UpdateHouseDto,
  ): Promise<{ affected: UpdateResult['affected'] }> {
    const { affected }: UpdateResult = await this.houseRepository.update(
      { houseId: id },
      updateHouseDto,
    );
    return { affected };
  }

  async remove(id: string): Promise<Omit<DeleteResult, 'raw'>> {
    const result: DeleteResult = await this.houseRepository.delete({
      houseId: id,
    });
    delete result.raw;
    return result;
  }
}
