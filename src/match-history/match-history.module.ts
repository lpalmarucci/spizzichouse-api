import { forwardRef, Module } from '@nestjs/common';
import { MatchHistoryController } from './match-history.controller';
import { MatchHistoryService } from './match-history.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchHistory } from '@/match-history/entities/match.history.entity';
import { UserModule } from '@/user/user.module';
import { MatchModule } from '@/match/match.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MatchHistory]),
    UserModule,
    forwardRef(() => MatchModule),
  ],
  controllers: [MatchHistoryController],
  providers: [MatchHistoryService],
  exports: [MatchHistoryService],
})
export class MatchHistoryModule {}
