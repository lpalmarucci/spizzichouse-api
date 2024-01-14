import { IsBoolean, IsInt, IsOptional, IsPositive } from 'class-validator';

export class CreateMatchDto {
  @IsPositive()
  @IsOptional()
  locationId: number;

  @IsPositive({ each: true })
  userIds: number[];

  @IsOptional()
  @IsBoolean()
  inProgress?: boolean;

  @IsInt()
  totalPoints: number;
}
