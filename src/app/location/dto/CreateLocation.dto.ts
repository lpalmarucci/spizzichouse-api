import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLocationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsOptional()
  @Type(() => String)
  playerIds: string[];

  @IsArray()
  @IsOptional()
  @Type(() => String)
  matchIds: string[];
}
