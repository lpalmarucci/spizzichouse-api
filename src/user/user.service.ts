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
import { FindOneOptions, FindOptionsRelations, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { LocationService } from '@/location/location.service';
import { UserDto } from '@/user/dto/user.dto';

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

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
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
    const newUser = await this.userRepository.save(user);
    delete newUser.password;
    return newUser;
  }

  async findAll(relations?: FindOptionsRelations<User>): Promise<UserDto[]> {
    const users = await this.userRepository.find({
      relations,
    });
    return users.map(UserDto.fromEntity);
  }

  async getByUsername(
    username: string,
    options?: FindOneOptions<User>,
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      ...options,
      where: { username },
    });
    if (!user) throw new NotFoundException(`User ${username} not found`);

    return user;
  }

  async findOne(
    id: number,
    relations?: FindOptionsRelations<User>,
  ): Promise<UserDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations,
    });
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return UserDto.fromEntity(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserDto> {
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
    const newUser = await this.userRepository.save(user);
    return UserDto.fromEntity(newUser);
  }

  async remove(id: number): Promise<UserDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    const deletedUser = await this.userRepository.remove(user);
    return UserDto.fromEntity(deletedUser);
  }
}
