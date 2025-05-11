import { Types } from 'mongoose';

export interface IApiKey {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  key: string;
  secret: string;
  permissions: string[];
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IApiKeyDocument extends IApiKey {
  save(): Promise<IApiKeyDocument>;
} 