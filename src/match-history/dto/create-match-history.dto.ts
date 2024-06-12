import { IsBoolean, IsInt, IsPositive } from 'class-validator';

export class CreateMatchHistoryDto {
  @IsPositive()
  matchId: number;

  @IsPositive()
  userId: number;

  @IsBoolean()
  win: boolean;

  @IsInt()
  totalScore: number;
}
