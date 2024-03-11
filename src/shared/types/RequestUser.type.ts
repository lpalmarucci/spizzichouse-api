import { Request } from 'express';

export type GoogleAuthInfo = {
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  accessToken: string;
  refreshToken?: string;
};

export type RequestUser = {
  user?: GoogleAuthInfo;
} & Request;
