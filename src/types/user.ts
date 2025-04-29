export type IUserLevel = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface IUser {
  _id: string;
  username: string;
  email: string;
  level: IUserLevel;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  _id: string;
  role: string;
  permissions: string[];
  email: string;
  username: string;
  referrerId?: string;
  createdAt: Date;
  updatedAt: Date;
} 