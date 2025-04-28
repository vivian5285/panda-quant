import { IUser } from '../../shared/models/user';
import { IAsset } from '../../shared/models/asset';
import { IFee } from '../../shared/models/fee';
interface IAssetWithChain extends IAsset {
    chain: string;
}
export declare class FeeService {
    private static instance;
    private constructor();
    static getInstance(): FeeService;
    private startFeeScheduler;
    private processMonthlyFees;
    private isNewUser;
    confirmDeposit(userId: string, txHash: string, amount: number, chain: string): Promise<boolean>;
    calculateFee(user: IUser, asset: IAsset, amount: number): Promise<number>;
    createFee(userId: string, amount: number, type: 'monthly' | 'withdrawal'): Promise<IFee>;
    processFee(feeId: string): Promise<void>;
    getMainAsset(userId: string): Promise<IAssetWithChain | null>;
}
export declare const feeService: FeeService;
export {};
