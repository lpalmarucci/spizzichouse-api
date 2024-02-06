import { PartialType } from '@nestjs/mapped-types';
import { CreateMatchHistoryDto } from '@/match-history/dto/create-match-history.dto';

export class UpdateMatchHistoryDto extends PartialType(CreateMatchHistoryDto) {}
