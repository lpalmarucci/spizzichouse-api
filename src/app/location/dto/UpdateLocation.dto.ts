import { PartialType } from '@nestjs/mapped-types';
import { CreateLocationDto } from './CreateLocation.dto';

export class UpdateLocationDto extends PartialType(CreateLocationDto) {}
