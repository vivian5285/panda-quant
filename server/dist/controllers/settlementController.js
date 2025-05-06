import { SettlementService } from '../services/SettlementService';
import { SettlementStatus } from '../types/Enums';
import Settlement from '../models/Settlement';
import { logger } from '../utils/logger';
import { Types } from 'mongoose';
export class SettlementController {
    constructor() {
        this.getSettlements = async (req, res) => {
            try {
                if (!req.user) {
                    res.status(401).json({ message: 'Unauthorized' });
                    return;
                }
                const settlements = await Settlement.find({ userId: new Types.ObjectId(req.user['id']) });
                res.json(settlements);
            }
            catch (error) {
                logger.error('Error getting settlements:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        };
        this.getSettlementDetails = async (req, res) => {
            try {
                if (!req.user) {
                    res.status(401).json({ message: 'Unauthorized' });
                    return;
                }
                const settlement = await this.settlementService.getSettlementById(req.params['id']);
                if (!settlement) {
                    res.status(404).json({ message: 'Settlement not found' });
                    return;
                }
                res.json(settlement);
            }
            catch (error) {
                res.status(500).json({ message: 'Error getting settlement details', error });
            }
        };
        this.createSettlement = async (req, res) => {
            try {
                if (!req.user) {
                    res.status(401).json({ message: 'Unauthorized' });
                    return;
                }
                const settlement = new Settlement({
                    ...req.body,
                    userId: new Types.ObjectId(req.user['id'])
                });
                await settlement.save();
                res.status(201).json(settlement);
            }
            catch (error) {
                logger.error('Error creating settlement:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        };
        this.updateSettlementStatus = async (req, res) => {
            try {
                if (!req.user) {
                    res.status(401).json({ message: 'Unauthorized' });
                    return;
                }
                const { id } = req.params;
                const { status } = req.body;
                if (!Object.values(SettlementStatus).includes(status)) {
                    res.status(400).json({ error: 'Invalid status' });
                    return;
                }
                const settlement = await Settlement.findByIdAndUpdate(new Types.ObjectId(id), { status }, { new: true });
                if (!settlement) {
                    res.status(404).json({ error: 'Settlement not found' });
                    return;
                }
                res.json(settlement);
            }
            catch (error) {
                logger.error('Error updating settlement status:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        };
        this.getSettlementSummary = async (req, res) => {
            try {
                if (!req.user) {
                    res.status(401).json({ message: 'Unauthorized' });
                    return;
                }
                const { startDate, endDate } = req.query;
                if (!startDate || !endDate) {
                    res.status(400).json({ message: 'Start date and end date are required' });
                    return;
                }
                const summary = await this.settlementService.getSettlementSummary(new Date(startDate), new Date(endDate));
                res.json(summary);
            }
            catch (error) {
                res.status(500).json({ message: 'Error getting settlement summary', error });
            }
        };
        this.exportSettlements = async (req, res) => {
            try {
                if (!req.user) {
                    res.status(401).json({ message: 'Unauthorized' });
                    return;
                }
                const settlements = await Settlement.find({ userId: new Types.ObjectId(req.user['id']) });
                res.json(settlements);
            }
            catch (error) {
                logger.error('Error exporting settlements:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        };
        this.generateSettlements = async (req, res) => {
            try {
                if (!req.user) {
                    res.status(401).json({ message: 'Unauthorized' });
                    return;
                }
                // 实现生成结算的逻辑
                res.json({ message: 'Settlements generated successfully' });
            }
            catch (error) {
                logger.error('Error generating settlements:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        };
        this.processPayment = async (req, res) => {
            try {
                if (!req.user) {
                    res.status(401).json({ message: 'Unauthorized' });
                    return;
                }
                const { id } = req.params;
                const settlement = await Settlement.findById(new Types.ObjectId(id));
                if (!settlement) {
                    res.status(404).json({ message: 'Settlement not found' });
                    return;
                }
                // 实现处理支付的逻辑
                res.json({ message: 'Payment processed successfully' });
            }
            catch (error) {
                logger.error('Error processing payment:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        };
        this.updateSettlement = async (req, res) => {
            try {
                if (!req.user) {
                    res.status(401).json({ message: 'Unauthorized' });
                    return;
                }
                const { id } = req.params;
                const settlement = await Settlement.findByIdAndUpdate(new Types.ObjectId(id), req.body, { new: true });
                if (!settlement) {
                    res.status(404).json({ message: 'Settlement not found' });
                    return;
                }
                res.json(settlement);
            }
            catch (error) {
                logger.error('Error updating settlement:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        };
        this.settlementService = SettlementService.getInstance();
    }
}
//# sourceMappingURL=settlementController.js.map