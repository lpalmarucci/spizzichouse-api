import { forwardRef, Module } from '@nestjs/common';
import { RoundService } from './round.service';
import { RoundController } from './round.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Round } from '@/round/entities/round.entity';
import { MatchModule } from '@/match/match.module';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Round]),
    forwardRef(() => MatchModule),
    UserModule,
  ],
  controllers: [RoundController],
  providers: [RoundService],
  exports: [RoundService],
})
export class RoundModule {}
