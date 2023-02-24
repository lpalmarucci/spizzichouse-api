import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategy/local.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/User.entity';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRATION') },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [AuthenticationService, LocalStrategy, JwtStrategy],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
