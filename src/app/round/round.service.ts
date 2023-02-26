import { UserService } from './../user/user.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateRoundDto } from './dto/CreateRound.dto';
import { UpdateRoundDto } from './dto/UpdateRound.dto';
import { Round } from './entities/round.entity';

@Injectable()
export class RoundService {
  constructor(
    @InjectRepository(Round)
    private readonly roundRepository: Repository<Round>,
    private readonly userService: UserService,
  ) {}
  async create(createRoundDto: CreateRoundDto) {
    const { userId, ...newUserDto } = createRoundDto;
    const user = await this.userService.findById(userId);
    return this.roundRepository.save({ ...newUserDto, user }, {});
  }

  async findAll(): Promise<Round[]> {
    return this.roundRepository.find();
  }

  async findOne(id: string): Promise<Round> {
    const round = await this.roundRepository.findOneBy({
      roundId: id,
    });
    if (!round) throw new NotFoundException(`Round not found`);
    return round;
  }

  async update(id: string, updateRoundDto: UpdateRoundDto): Promise<Round> {
    const round: Round = await this.findOne(id);
    const { userId, ...newRoundDto } = updateRoundDto;
    const user = await this.userService.findById(userId);
    round.user = user;
    return await this.roundRepository.save({ ...round, ...newRoundDto });
  }

  async remove(id: string): Promise<Omit<DeleteResult, 'raw'>> {
    const result: DeleteResult = await this.roundRepository.delete({
      roundId: id,
    });
    delete result.raw;
    return result;
  }
}
