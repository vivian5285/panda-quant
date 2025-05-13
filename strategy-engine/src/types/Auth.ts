import { IUser } from './User';
import { UserRole } from './Enums';

export interface IAuthToken {
  token: string;
  expiresIn: number;
}

export interface IAuthResponse {
  user: IUser;
  token: IAuthToken;
}

export interface IAuthRequest {
  email: string;
  password: string;
}

export interface IAuthMiddleware {
  user: IUser;
  role: UserRole;
} 