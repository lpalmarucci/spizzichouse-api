import {
  ClassSerializerInterceptor,
  Controller,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../authentication/guard/JwtAuth.guard';

@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({
  excludePrefixes: ['_'],
})
@Controller()
export class BaseController {}
