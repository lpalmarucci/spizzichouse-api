import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateLocationDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsInt({ each: true })
  @IsOptional()
  userIds: number[];
}
