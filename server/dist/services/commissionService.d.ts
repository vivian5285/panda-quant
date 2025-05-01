/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Types } from 'mongoose';
import { ICommission, ICommissionRule } from '../types/commission';
export declare class CommissionService {
    private static instance;
    private constructor();
    static getInstance(): CommissionService;
    private convertToICommission;
    private convertToICommissionRule;
    createCommission(commissionData: Partial<ICommission>): Promise<ICommission>;
    getCommissionById(id: string): Promise<ICommission | null>;
    getCommissionByUserId(userId: string): Promise<ICommission | null>;
    updateCommission(id: string, updateData: Partial<ICommission>): Promise<ICommission | null>;
    deleteCommission(id: string): Promise<boolean>;
    getCommissionsByUserId(userId: string): Promise<ICommission[]>;
    getCommissionsByStatus(status: string): Promise<ICommission[]>;
    getCommissionsByDateRange(startDate: Date, endDate: Date): Promise<ICommission[]>;
    getCommissionsByType(type: string): Promise<ICommission[]>;
    getCommissionsByUserAndDateRange(userId: string, startDate: Date, endDate: Date): Promise<ICommission[]>;
    getCommissionsByUserAndStatus(userId: string, status: string): Promise<ICommission[]>;
    getCommissionsByUserAndType(userId: string, type: string): Promise<ICommission[]>;
    getCommissionsByUserAndDateRangeAndStatus(userId: string, startDate: Date, endDate: Date, status: string): Promise<ICommission[]>;
    getCommissionsByUserAndDateRangeAndType(userId: string, startDate: Date, endDate: Date, type: string): Promise<ICommission[]>;
    getCommissionsByUserAndDateRangeAndStatusAndType(userId: string, startDate: Date, endDate: Date, status: string, type: string): Promise<ICommission[]>;
    getCommissionsByDateRangeAndStatus(startDate: Date, endDate: Date, status: string): Promise<ICommission[]>;
    getCommissionsByDateRangeAndType(startDate: Date, endDate: Date, type: string): Promise<ICommission[]>;
    getCommissionsByDateRangeAndStatusAndType(startDate: Date, endDate: Date, status: string, type: string): Promise<ICommission[]>;
    getCommissionsByStatusAndType(status: string, type: string): Promise<ICommission[]>;
    getCommissionsByUserAndStatusAndType(userId: string, status: string, type: string): Promise<ICommission[]>;
    getCommissionsByUserAndDateRangeAndStatusAndTypeAndAmount(userId: string, startDate: Date, endDate: Date, status: string, type: string, amount: number): Promise<ICommission[]>;
    getCommissionsByDateRangeAndStatusAndTypeAndAmount(startDate: Date, endDate: Date, status: string, type: string, amount: number): Promise<ICommission[]>;
    getCommissionsByStatusAndTypeAndAmount(status: string, type: string, amount: number): Promise<ICommission[]>;
    getCommissionsByUserAndStatusAndTypeAndAmount(userId: string, status: string, type: string, amount: number): Promise<ICommission[]>;
    getCommissionsByUserAndDateRangeAndStatusAndTypeAndAmountAndCurrency(userId: string, startDate: Date, endDate: Date, status: string, type: string, amount: number, currency: string): Promise<ICommission[]>;
    getCommissionsByDateRangeAndStatusAndTypeAndAmountAndCurrency(startDate: Date, endDate: Date, status: string, type: string, amount: number, currency: string): Promise<ICommission[]>;
    getCommissionsByStatusAndTypeAndAmountAndCurrency(status: string, type: string, amount: number, currency: string): Promise<ICommission[]>;
    getCommissionsByUserAndStatusAndTypeAndAmountAndCurrency(userId: string, status: string, type: string, amount: number, currency: string): Promise<ICommission[]>;
    getCommissionsByUserAndDateRangeAndStatusAndTypeAndAmountAndCurrencyAndDescription(userId: string, startDate: Date, endDate: Date, status: string, type: string, amount: number, currency: string, description: string): Promise<ICommission[]>;
    getCommissionsByDateRangeAndStatusAndTypeAndAmountAndCurrencyAndDescription(startDate: Date, endDate: Date, status: string, type: string, amount: number, currency: string, description: string): Promise<ICommission[]>;
    getCommissionsByStatusAndTypeAndAmountAndCurrencyAndDescription(status: string, type: string, amount: number, currency: string, description: string): Promise<ICommission[]>;
    getCommissionsByUserAndStatusAndTypeAndAmountAndCurrencyAndDescription(userId: string, status: string, type: string, amount: number, currency: string, description: string): Promise<ICommission[]>;
    getCommissionRules(): Promise<ICommissionRule[]>;
    createCommissionRule(data: Partial<ICommissionRule>): Promise<ICommissionRule>;
    updateCommissionRule(rule: ICommissionRule): Promise<ICommissionRule | null>;
    deleteCommissionRule(id: Types.ObjectId): Promise<boolean>;
}
