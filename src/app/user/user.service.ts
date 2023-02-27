import { HouseService } from '../location/location.service';
import { House } from '../location/entities/location.entity';
import {
  BadRequestException,
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
    private houseService: HouseService,
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
    let newUserDto: DeepPartial<User> = {
      ...userDto,
    };
    if (userDto.houseId) {
      const house: House = await this.houseService.findOne(userDto.houseId);
      newUserDto.house = house;
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
    const { houseId, ...updatedUser } = userDto;
    const house = await this.houseService.findOne(houseId);
    const user = await this.findById(userId);
    user.house = house;
    return await this.userRepository.save({ ...user, ...updatedUser });
  }

  async deleteUser(userId: string): Promise<Omit<DeleteResult, 'raw'>> {
    const result: DeleteResult = await this.userRepository.delete({ userId });
    delete result.raw;
    return result;
  }
}
