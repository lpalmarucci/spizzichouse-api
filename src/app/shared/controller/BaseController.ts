import {
  ClassSerializerInterceptor,
  Controller,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../authentication/guard/JwtAuth.guard';

@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({
  excludePrefixes: ['_id'],
})
@Controller()
export class BaseController {}
