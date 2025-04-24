import { get, post, put } from '@/utils/request';
import { StrategyRating } from './strategy';

export type UserStatus = 'active' | 'inactive' | 'banned';
export type UserLevel = 'normal' | 'vip';

export interface User {
  id: string;
  email: string;
  registerTime: string;
  status: UserStatus;
  balance: number;
  vipLevel: number;
  referrer?: string;
  profile?: UserProfile;
}

export interface UserProfile {
  riskTolerance: 'low' | 'medium' | 'high';
  tradingExperience: number;
  preferredChains: string[];
  strategyPreferences: string[];
  lastActiveTime: string;
  totalTrades: number;
  successRate: number;
  averageReturn: number;
}

export interface UserFilter {
  email?: string;
  status?: 'all' | UserStatus;
  startDate?: string;
  endDate?: string;
  vipLevel?: number;
  riskTolerance?: 'low' | 'medium' | 'high';
}

export interface UserResponse {
  users: User[];
  total: number;
}

export async function getUsers(filter: UserFilter): Promise<UserResponse> {
  return get('/users', filter);
}

export async function getUserDetails(id: string): Promise<User> {
  return get(`/users/${id}`);
}

export async function updateUserStatus(id: string, status: UserStatus): Promise<void> {
  return put(`/users/${id}/status`, { status });
}

export async function updateUserBalance(id: string, amount: number, reason: string): Promise<void> {
  return put(`/users/${id}/balance`, { amount, reason });
}

export async function updateUserProfile(id: string, profile: Partial<UserProfile>): Promise<void> {
  return put(`/users/${id}/profile`, profile);
}

export async function getUserStrategyRatings(id: string): Promise<StrategyRating[]> {
  return get(`/users/${id}/strategy-ratings`);
}

export async function createUser(user: Omit<User, 'id'>): Promise<User> {
  return post('/users', user);
}

export async function updateUser(id: string, user: Partial<User>): Promise<User> {
  return put(`/users/${id}`, user);
}

export async function deleteUser(id: string): Promise<void> {
  return post(`/users/${id}/delete`);
}

export async function updateUserLevel(id: string, level: UserLevel): Promise<void> {
  return put(`/users/${id}/level`, { level });
} 