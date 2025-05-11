import { IUserDocument } from '../models/User.model';

declare module 'express' {
  export interface Request {
    user?: IUserDocument;
    token?: string;
  }

  export interface Response {
    locals: {
      user?: IUserDocument;
      token?: string;
    };
  }
}

// 确保这个文件被视为模块
export {}; 