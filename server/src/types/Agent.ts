import { Document, Types } from 'mongoose';

export interface IAgentBase {
  userId: Types.ObjectId;
  name: string;
  type: string;
  status: string;
  config: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAgent extends IAgentBase {
  _id: Types.ObjectId;
}

export interface IAgentDocument extends Omit<Document, '_id'>, IAgent {}

export interface IAgentCreateInput {
  userId: Types.ObjectId;
  name: string;
  type: string;
  status: string;
  config: Record<string, any>;
}

export interface IAgentUpdateInput {
  name?: string;
  type?: string;
  status?: string;
  config?: Record<string, any>;
}

export type AgentCreateInput = Omit<IAgentBase, '_id' | 'createdAt' | 'updatedAt'>;
export type AgentUpdateInput = Partial<Omit<IAgentBase, 'userId'>>; 