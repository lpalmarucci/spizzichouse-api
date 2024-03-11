export interface IConfig {
  config: ICommonConfig;
  version: string;
  auth: IAuthConfig;
}

export interface IAuthConfig {
  google: IAuthenticationConfig;
  redirectUrl: string;
}

export interface IAuthenticationConfig {
  clientId: string;
  clientSecret: string;
}

export interface ICommonConfig {
  crypt: ICryptConfig;
}

export interface ICryptConfig {
  saltOrRounds: number;
  jwtSecret: string;
  jwtExpiration: string;
}
