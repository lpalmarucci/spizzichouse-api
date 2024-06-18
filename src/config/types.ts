export interface IConfig {
  config: ICommonConfig;
  env: string;
  version: string;
}

export interface ICommonConfig {
  crypt: ICryptConfig;
  database: IDatabaseConfig;
}

export interface IDatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  name: string;
  schema: string;
}

export interface ICryptConfig {
  saltOrRounds: number;
  jwtSecret: string;
  jwtExpiration: string;
}
