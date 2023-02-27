import { Module } from '@nestjs/common';
import { HouseService } from './location.service';
import { HouseController } from './location.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { House } from './entities/location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([House])],
  controllers: [HouseController],
  providers: [HouseService],
  exports: [HouseService],
})
export class HouseModule {}
