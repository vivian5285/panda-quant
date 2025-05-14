export interface IUser {
  id: string;
  email: string;
  username: string;
  password: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  preferences?: {
    theme?: string;
    notifications?: boolean;
    language?: string;
  };
} 