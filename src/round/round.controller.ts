import { Controller } from '@nestjs/common';
import { RoundService } from './round.service';

@Controller('round')
export class RoundController {
  constructor(private readonly roundService: RoundService) {}

  // @Get()
  // findAll(@Param('matchId') matchId: number, @Param('userId') userId: number) {
  //   return this.roundService.findAll(matchId, userId, { match: true });
  // }
  //
  // @Get(':id')
  // findOne(@Param('matchId') matchId: number, @Param('userId') userId: number) {
  //   return this.roundService.findOne(matchId, userId);
  // }
  //
  // @Post()
  // create(@Body() createRoundDto: CreateRoundDto) {
  //   return this.roundService.create(createRoundDto);
  // }
  //
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateRoundDto: UpdateRoundDto) {
  //   return this.roundService.update(+id, updateRoundDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.roundService.remove(+id);
  // }
}
