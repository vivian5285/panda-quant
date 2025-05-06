import { logger } from '../utils/logger';
import { CommissionService } from '../services/CommissionService';
import { ProfitService } from '../services/ProfitService';
export class ProfitController {
    constructor() {
        this.getProfitSummary = async (_req, res) => {
            try {
                const summary = await this.profitService.getProfitSummary();
                res.json(summary);
            }
            catch (error) {
                logger.error('Error getting profit summary:', error);
                res.status(500).json({ message: 'Error getting profit summary', error: error.message });
            }
        };
        this.updateCommission = async (req, res) => {
            try {
                const { id } = req.params;
                const updates = req.body;
                const commission = await this.commissionService.updateCommission(id.toString(), updates);
                res.status(200).json(commission);
            }
            catch (error) {
                logger.error('Error updating commission:', error);
                res.status(500).json({ message: 'Error updating commission', error });
            }
        };
        this.deleteCommission = async (req, res) => {
            try {
                const { id } = req.params;
                await this.commissionService.deleteCommission(id.toString());
                res.status(204).send();
            }
            catch (error) {
                logger.error('Error deleting commission:', error);
                res.status(500).json({ message: 'Error deleting commission', error });
            }
        };
        this.commissionService = CommissionService.getInstance();
        this.profitService = ProfitService.getInstance();
    }
}
export default new ProfitController();
//# sourceMappingURL=profitController.js.map