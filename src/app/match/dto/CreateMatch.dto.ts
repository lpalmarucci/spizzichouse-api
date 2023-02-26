import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMatchDto {
  @IsBoolean()
  @IsOptional()
  inProgress: boolean;

  @IsString()
  @IsNotEmpty()
  locationId: string;

  @IsArray()
  @IsNotEmpty()
  @Type(() => String)
  playerIds: string[];

  @IsNumber({
    allowNaN: false,
  })
  maxPoints: number;
}
