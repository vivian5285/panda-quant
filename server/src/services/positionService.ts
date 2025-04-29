import { Model } from 'mongoose';
import { IPosition } from '../interfaces/IPosition';
import { Position } from '../models/Position';

export class PositionService {
  private static instance: PositionService;
  private positionModel: Model<IPosition>;

  public static getInstance(): PositionService {
    if (!PositionService.instance) {
      PositionService.instance = new PositionService();
    }
    return PositionService.instance;
  }

  constructor() {
    this.positionModel = Position;
  }

  async createPosition(data: Partial<IPosition>) {
    return this.positionModel.create(data);
  }

  async getPositions(userId: string) {
    return this.positionModel.find({ userId });
  }
}

export const positionService = PositionService.getInstance(); 