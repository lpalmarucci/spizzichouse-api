import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { MatchService } from './match.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { RoundService } from '@/round/round.service';

@Controller('match')
export class MatchController {
  constructor(
    private readonly matchService: MatchService,
    private readonly roundService: RoundService,
  ) {}

  @Post()
  create(@Body() createMatchDto: CreateMatchDto) {
    return this.matchService.create(createMatchDto);
  }

  @Get()
  findAll() {
    return this.matchService.findAll({ location: true });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matchService.findOne(+id, { location: true, rounds: true });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMatchDto: UpdateMatchDto) {
    return this.matchService.update(+id, updateMatchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.matchService.remove(+id);
  }

  @Get(':id/round')
  getRounds(@Param('id') matchId: number) {
    return this.roundService.getByMatchId(matchId);
  }
}
