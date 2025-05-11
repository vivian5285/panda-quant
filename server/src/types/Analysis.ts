import { Types } from 'mongoose';

export interface IAnalysis {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  strategyId: Types.ObjectId;
  type: string;
  data: Record<string, any>;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAnalysisDocument extends IAnalysis {
  save(): Promise<IAnalysisDocument>;
}

 