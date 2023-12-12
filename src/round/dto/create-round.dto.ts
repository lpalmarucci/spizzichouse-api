import { IsBoolean, IsInt, IsOptional } from 'class-validator';

export class CreateRoundDto {
  @IsInt()
  userId: number;

  @IsOptional()
  @IsBoolean()
  isGameLost?: boolean;

  @IsInt()
  numPoints: number;
}
