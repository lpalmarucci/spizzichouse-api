import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '@/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthGuard } from '@/auth/guards/auth-guard.service';
import { APP_GUARD } from '@nestjs/core';
import { GoogleStrategy } from '@/auth/strategy/google.strategy';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '@/auth/strategy/local.strategy';
import { JwtStrategy } from '@/auth/strategy/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    UserModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('config.crypt.jwtSecret'),
        signOptions: {
          expiresIn: configService.get<string>('config.crypt.jwtExpiration'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AuthService,
    GoogleStrategy,
    LocalStrategy,
    JwtStrategy,
  ],
})
export class AuthModule {}
