import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RoundService } from './round.service';
import { CreateRoundDto } from './dto/CreateRound.dto';
import { UpdateRoundDto } from './dto/UpdateRound.dto';
import { BaseController } from '../shared/controller/BaseController';

@Controller('rounds')
export class RoundController extends BaseController {
  constructor(private readonly roundService: RoundService) {
    super();
  }

  @Post()
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  )
  create(@Body() createRoundDto: CreateRoundDto) {
    return this.roundService.create(createRoundDto);
  }

  @Get()
  findAll() {
    return this.roundService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roundService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  update(@Param('id') id: string, @Body() updateRoundDto: UpdateRoundDto) {
    return this.roundService.update(id, updateRoundDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roundService.remove(id);
  }
}
