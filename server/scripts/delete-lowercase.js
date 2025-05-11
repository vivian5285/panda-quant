const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, '..', 'src', 'models');

// 要删除的文件列表
const files = [
  'user.model.ts',
  'strategy.model.ts',
  'order.model.ts',
  'trade.model.ts',
  'position.model.ts',
  'commission.model.ts',
  'commission-rule.model.ts',
  'commission-withdrawal.model.ts',
  'commission-record.model.ts',
  'withdrawal.model.ts',
  'deposit.model.ts',
  'deposit-notification.model.ts',
  'health.model.ts',
  'network-status.model.ts',
  'notification.model.ts',
  'performance.model.ts',
  'platform-earning.model.ts',
  'risk-event.model.ts',
  'settings.model.ts',
  'strategy-performance.model.ts',
  'strategy-rating.model.ts',
  'strategy-review.model.ts',
  'transaction.model.ts',
  'user-earning.model.ts',
  'user-level.model.ts'
];

// 删除文件
console.log('Starting file deletion...');
files.forEach(filename => {
  const filePath = path.join(modelsDir, filename);
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Deleted ${filename}`);
    }
  } catch (error) {
    console.error(`Error deleting ${filename}:`, error);
  }
});
console.log('File deletion completed.'); 