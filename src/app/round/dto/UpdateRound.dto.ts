import { PartialType } from '@nestjs/mapped-types';
import { CreateRoundDto } from './CreateRound.dto';

export class UpdateRoundDto extends PartialType(CreateRoundDto) {}
