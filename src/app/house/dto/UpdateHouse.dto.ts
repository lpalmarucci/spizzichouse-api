import { PartialType } from '@nestjs/mapped-types';
import { CreateHouseDto } from './CreateHouse.dto';

export class UpdateHouseDto extends PartialType(CreateHouseDto) {}
