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
import { CreateRoundDto } from '@/round/dto/create-round.dto';
import { UpdateRoundDto } from '@/round/dto/update-round.dto';

@Controller('matches')
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

  //ROUND
  @Get(':matchId/rounds')
  getRoundsByMatch(@Param('matchId') matchId: number) {
    return this.roundService.getByMatch(matchId);
  }

  @Get(':matchId/users/:userId/rounds')
  getRoundsByMatchAndUser(
    @Param('matchId') matchId: number,
    @Param('userId') userId: number,
  ) {
    return this.roundService.getByMatchAndUser(matchId, userId);
  }

  @Post(':matchId/users/:userId/rounds/:roundId')
  createRoundForMatchAndUser(
    @Param('matchId') matchId: number,
    @Param('userId') userId: number,
    @Param('roundId') roundId: number,
    @Body() createRoundDto: CreateRoundDto,
  ) {
    return this.roundService.create(matchId, userId, roundId, createRoundDto);
  }

  @Patch(':matchId/users/:userId/rounds/:roundId')
  updateRoundForMatchAndUser(
    @Param('matchId') matchId: number,
    @Param('userId') userId: number,
    @Param('roundId') roundId: number,
    @Body() updateRoundDto: UpdateRoundDto,
  ) {
    return this.roundService.update(matchId, userId, roundId, updateRoundDto);
  }

  @Delete(':matchId/users/:userId/rounds/:roundId')
  deleteRoundForMatchAndUser(
    @Param('matchId') matchId: number,
    @Param('userId') userId: number,
    @Param('roundId') roundId: number,
  ) {
    return this.roundService.deleteRoundForMatchAndUser(
      matchId,
      userId,
      roundId,
    );
  }
}
