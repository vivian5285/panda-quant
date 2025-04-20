import { Router } from 'express';
import { AssetController } from '../controllers/asset.controller';

const router = Router();
const assetController = new AssetController();

router.get('/', assetController.getAssets);
router.post('/', assetController.addAsset);
router.put('/:id', assetController.updateAsset);
router.delete('/:id', assetController.deleteAsset);

export default router; 