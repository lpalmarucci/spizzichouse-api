import { PartialType } from '@nestjs/mapped-types';
import { CreateHouseDto } from './CreateLocation.dto';

export class UpdateHouseDto extends PartialType(CreateHouseDto) {}
