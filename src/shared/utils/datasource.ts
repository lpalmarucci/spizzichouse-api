import * as path from 'path';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config();

const datasource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  schema: process.env.DATABASE_SCHEMA,
  logging: process.env.NODE_ENV === 'development',
  entities: [path.join(process.cwd(), '**/*.entity{.ts,.js}')],
  migrations: [path.join(process.cwd(), 'migrations/**/*{.ts,.js}')],
  synchronize: false,
});
export default datasource;
