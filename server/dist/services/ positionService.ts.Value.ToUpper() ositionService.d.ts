import { IPosition } from '../interfaces/IPosition';
import { Document } from 'mongoose';
export declare class PositionService {
    private static instance;
    private model;
    static getInstance(): PositionService;
    private constructor();
    createPosition(data: Partial<IPosition>): Promise<IPosition & Document>;
    updatePosition(id: string, data: Partial<IPosition>): Promise<(IPosition & Document) | null>;
    getPosition(id: string): Promise<(IPosition & Document) | null>;
    getAllPositions(): Promise<(IPosition & Document)[]>;
    deletePosition(id: string): Promise<boolean>;
    getPositionsByUser(userId: string): Promise<(IPosition & Document)[]>;
    getOpenPositions(userId: string): Promise<(IPosition & Document)[]>;
    getClosedPositions(userId: string): Promise<(IPosition & Document)[]>;
    getPositionStats(userId: string): Promise<{
        total: number;
        open: number;
        closed: number;
        totalProfitLoss: number;
    }>;
    closePosition(id: string, currentPrice: number): Promise<(IPosition & Document) | null>;
}
