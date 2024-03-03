export type UserType = {
  sub: number;
  username: string;
  iat: number;
  exp: number;
};

export type RequestUser = { user: UserType } & Request;
