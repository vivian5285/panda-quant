export class PositionService {
  private static instance: PositionService;
  private positionModel: Model<IPosition>;

  public static getInstance(): PositionService {
    if (!PositionService.instance) {
      PositionService.instance = new PositionService();
    }
    return PositionService.instance;
  }
}

export const positionService = PositionService.getInstance(); 