import { IsInt } from 'class-validator';

export class CreateRoundDto {
  @IsInt()
  points: number;
}
