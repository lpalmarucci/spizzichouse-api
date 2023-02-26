import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './User.entity';
import { HouseModule } from '../house/house.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), HouseModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
