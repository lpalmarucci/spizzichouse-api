import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { UserModule } from '@/user/user.module';
import { LocationModule } from './location/location.module';
import { MatchModule } from './match/match.module';
import { RoundModule } from './round/round.module';
import { AuthModule } from './auth/auth.module';
import { MatchHistoryModule } from './match-history/match-history.module';
import config from '@/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IDatabaseConfig } from '@/config/types';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get<IDatabaseConfig>('config.database');
        const env = configService.get<string>('env');
        return {
          type: 'postgres',
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.user,
          password: dbConfig.password,
          database: dbConfig.name,
          schema: dbConfig.schema,
          logging: env === 'development',
          autoLoadEntities: true,
          entities: ['src/**/*{.entity.ts}'],
          synchronize: env === 'development',
          migrations: ['./dist/migrations/*'],
          migrationsRun: env !== 'development',
        };
      },
    }),
    ConfigModule.forRoot({
      load: [config],
    }),
    // DatasourceModule,
    UserModule,
    LocationModule,
    MatchModule,
    RoundModule,
    AuthModule,
    MatchHistoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
