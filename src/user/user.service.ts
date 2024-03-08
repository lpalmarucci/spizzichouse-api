import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/user/entities/user.entity';
import { FindOptionsRelations, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { LocationService } from '@/location/location.service';

@Injectable()
export class UserService {
  private readonly saltOrRounds: number;
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => LocationService))
    private readonly locationService: LocationService,
  ) {
    this.saltOrRounds = this.configService.get<number>(
      'config.crypt.saltOrRounds',
    );
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const username = createUserDto.username;
    const usernameAlreadyExists = await this.userRepository.findOne({
      where: { username },
    });
    if (usernameAlreadyExists) {
      throw new BadRequestException('username already taken');
    }

    const location =
      createUserDto.locationId &&
      (await this.locationService.findOne(createUserDto.locationId));

    const hashPassword = await bcrypt.hash(
      createUserDto.password,
      this.saltOrRounds,
    );
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashPassword,
      location,
    });
    return this.userRepository.save(user);
  }

  findAll(relations?: FindOptionsRelations<User>) {
    return this.userRepository.find({
      relations,
    });
  }

  async getByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { username },
    });
    if (!user) throw new NotFoundException(`User ${username} not found`);

    return user;
  }

  async findOne(id: number, relations?: FindOptionsRelations<User>) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations,
    });
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const location =
      updateUserDto.locationId &&
      (await this.locationService.findOne(updateUserDto.locationId));
    let newPassword: string | undefined;
    if (updateUserDto.password) {
      newPassword = await bcrypt.hash(
        updateUserDto.password,
        this.saltOrRounds,
      );
    }

    const user = await this.userRepository.preload({
      id,
      ...updateUserDto,
      location,
      password: newPassword,
    });
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return this.userRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    return this.userRepository.remove(user);
  }
}
