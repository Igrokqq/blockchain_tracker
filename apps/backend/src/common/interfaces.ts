export type TokenPayload = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export interface UserTokenObject extends TokenPayload {
  iat: number;
  exp: number;
}
