export interface IConfig {
  config: ICommonConfig;
  version: string;
}

export interface ICommonConfig {
  crypt: ICryptConfig;
}

export interface ICryptConfig {
  saltOrRounds: number;
  jwtSecret: string;
  jwtExpiration: string;
}
