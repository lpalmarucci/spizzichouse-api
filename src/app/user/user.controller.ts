import { CreateUserDto } from './dto/CreateUser.dto';
import { UserService } from './user.service';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { BaseController } from '../shared/BaseController';

@Controller('users')
export class UserController extends BaseController {
  constructor(private readonly userService: UserService) {
    super();
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findById(@Param('id') userId: string) {
    return this.userService.findById(userId);
  }

  @Post('new')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  createUser(@Body() userDto: CreateUserDto) {
    if (!userDto || Object.keys(userDto).length === 0) {
      throw new BadRequestException();
    }
    return this.userService.createUser(userDto);
  }

  @Patch(':id')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  updateUser(@Param('id') userId: string, @Body() userDto: UpdateUserDto) {
    return this.userService.updateUser(userId, userDto);
  }

  @Delete(':id')
  deleteUser(@Param('id') userId: string) {
    return this.userService.deleteUser(userId);
  }
}
