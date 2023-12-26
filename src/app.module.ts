import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '@/user/user.module';
import { LocationModule } from './location/location.module';
import { MatchModule } from './match/match.module';
import { RoundModule } from './round/round.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import config from '@/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DATABASE_HOST,
        port: +process.env.DATABASE_PORT,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        autoLoadEntities: true,
        entities: ['src/**/*{.entity.ts}'],
        synchronize: process.env.NODE_ENV === 'development',
      }),
    }),
    ConfigModule.forRoot({
      load: [config],
    }),
    UserModule,
    LocationModule,
    MatchModule,
    RoundModule,
    AuthModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
