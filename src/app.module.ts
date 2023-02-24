import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './app/authentication/authentication.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { UserModule } from './app/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['./src/envs/.env.development'],
    }),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.DATABASE_URL,
      database: process.env.DATABASE_NAME,
      logging: true,
      autoLoadEntities: true,
      useNewUrlParser: true,
      entities: [join(__dirname, '**/**.entity{.ts,.js}')],
      useUnifiedTopology: true,
      synchronize: true,
    }),
    UserModule,
    AuthenticationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
