import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRoundDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsNumber()
  @IsNotEmpty()
  points: number;
}
