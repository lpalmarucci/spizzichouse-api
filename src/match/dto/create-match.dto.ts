import { IsBoolean, IsInt, IsOptional, IsPositive } from 'class-validator';

export class CreateMatchDto {
  @IsPositive()
  locationId: number;

  @IsPositive({ each: true })
  userIds: number[];

  @IsOptional()
  @IsBoolean()
  inProgress?: boolean;

  @IsInt()
  totalPoints: number;
}
