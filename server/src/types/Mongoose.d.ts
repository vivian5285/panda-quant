import { Document, Schema } from 'mongoose';

declare module 'mongoose' {
  interface SchemaDefinitionProperty<T> {
    type: any;
    ref?: string;
    required?: boolean;
  }
}

export {}; 