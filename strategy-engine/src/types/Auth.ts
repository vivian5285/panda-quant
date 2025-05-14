import { IUser } from './User';

export interface IAuthToken {
  type: string;
  token: string;
  expiresIn: number;
}

export interface IAuthResponse {
  user: IUser;
  token: IAuthToken;
} 