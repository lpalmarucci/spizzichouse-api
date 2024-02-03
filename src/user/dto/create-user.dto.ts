import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly firstname: string;
  @IsString()
  readonly lastname: string;
  @IsString()
  readonly username: string;
  @IsString()
  readonly password: string;
  @IsNumber()
  @IsOptional()
  readonly totalWins: number;
  @IsNumber()
  @IsOptional()
  readonly totalPlayed: number;
  @IsInt()
  @IsOptional()
  readonly locationId?: number;
}
