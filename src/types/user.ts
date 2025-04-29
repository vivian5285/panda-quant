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