import { PartialType } from '@nestjs/mapped-types';
import { CreateMatchDto } from './CreateMatch.dto';

export class UpdateMatchDto extends PartialType(CreateMatchDto) {}
