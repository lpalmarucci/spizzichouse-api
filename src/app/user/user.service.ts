import { LocationService } from '../location/location.service';
import { Location } from '../location/entities/location.entity';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './User.entity';
import { DeepPartial, DeleteResult, Repository } from 'typeorm';
import { CreateUserDto } from './dto/CreateUser.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/UpdateUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private configService: ConfigService,
    @Inject(forwardRef(() => LocationService))
    private houseService: LocationService,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findById(userId: string): Promise<User> {
    const user: User = await this.userRepository.findOne({
      where: {
        userId,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        username: username,
      },
    });
  }

  async createUser(userDto: CreateUserDto): Promise<User> {
    const newUserDto: DeepPartial<User> = {
      ...userDto,
    };
    if (userDto.locationId) {
      const house: Location = await this.houseService.findOne(
        userDto.locationId,
      );
      newUserDto.location = house;
    }
    const saltOrRounds: number = +this.configService.get('SALT_OR_ROUNDS');
    const password: string = await bcrypt.hash(userDto.password, saltOrRounds);
    newUserDto.password = password;

    const newUser = this.userRepository.create(newUserDto);

    await this.userRepository.save(newUser).catch((e) => {
      if (e.code === '23505')
        throw new BadRequestException('Username already taken');
    });

    return newUser;
  }

  async updateUser(userId: string, userDto: UpdateUserDto): Promise<User> {
    const { locationId, ...updatedUser } = userDto;
    const house = await this.houseService.findOne(locationId);
    const user = await this.findById(userId);
    user.location = house;
    const result = await this.userRepository.save({ ...user, ...updatedUser });
    return new User(result);
  }

  async deleteUser(userId: string): Promise<Omit<DeleteResult, 'raw'>> {
    const result: DeleteResult = await this.userRepository.delete({ userId });
    delete result.raw;
    return result;
  }
}
