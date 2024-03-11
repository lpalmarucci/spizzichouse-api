import { IConfig } from '@/config/types';

export default (): IConfig => ({
  config: {
    crypt: {
      saltOrRounds: +process.env.SALT_OR_ROUNDS ?? 10,
      jwtSecret: process.env.JWT_SECRET,
      jwtExpiration: process.env.JWT_EXPIRATION,
    },
  },
  version: process.env.API_VERSION ?? '0.0.1',
  auth: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    redirectUrl: process.env.REDIRECT_URL,
  },
});
