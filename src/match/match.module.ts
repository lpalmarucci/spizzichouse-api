import { forwardRef, Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from '@/match/entities/match.entity';
import { LocationModule } from '@/location/location.module';
import { RoundModule } from '@/round/round.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Match]),
    LocationModule,
    forwardRef(() => RoundModule),
  ],
  controllers: [MatchController],
  providers: [MatchService],
  exports: [MatchService],
})
export class MatchModule {}
