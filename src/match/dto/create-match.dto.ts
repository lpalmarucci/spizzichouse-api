import { IsBoolean, IsInt, IsOptional, IsPositive } from 'class-validator';

export class CreateMatchDto {
  @IsPositive()
  locationId: number;

  @IsOptional()
  @IsBoolean()
  inProgress?: boolean;

  @IsInt()
  maxPointsEachRound: number;

  @IsInt()
  totalPoints: number;
}
