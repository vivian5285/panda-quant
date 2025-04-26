import mongoose, { Document, Schema } from 'mongoose';

export interface IChain extends Document {
  name: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

const chainSchema = new Schema<IChain>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    address: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// 创建索引
chainSchema.index({ name: 1 });

const Chain = mongoose.model<IChain>('Chain', chainSchema);

export default Chain; 