import { IConfig } from '@/config/types';

export default (): IConfig => ({
  config: {
    crypt: {
      saltOrRounds: +process.env.SALT_OR_ROUNDS ?? 10,
      jwtSecret: process.env.JWT_SECRET,
      jwtExpiration: process.env.JWT_EXPIRATION,
    },
    database: {
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      name: process.env.DATABASE_NAME,
      schema: process.env.DATABASE_SCHEMA,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
    },
  },
  env: process.env.NODE_ENV ?? 'development',
  version: process.env.API_VERSION ?? '0.0.1',
});
