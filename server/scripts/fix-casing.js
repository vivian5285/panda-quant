const fs = require('fs');
const path = require('path');

// 需要重命名的文件映射
const fileMappings = {
    'src/clients/api.ts': 'Api.ts',
    'src/controllers/strategyRatingController.ts': 'StrategyRatingController.ts',
    'src/services/profitService.ts': 'ProfitService.ts',
    'src/types/commissionRecord.ts': 'CommissionRecord.ts',
    'src/types/index.ts': 'Index.ts',
    'src/types/router.d.ts': 'Router.d.ts',
    'src/types/strategyPerformance.ts': 'StrategyPerformance.ts',
    'src/validations/common/index.ts': 'Index.ts',
    'src/validations/schemas/index.ts': 'Index.ts',
    // 新增的文件映射
    'src/services/adminservice.ts': 'AdminService.ts',
    'src/services/settlementservice.ts': 'SettlementService.ts',
    'src/services/strategyservice.ts': 'StrategyService.ts',
    'src/types/commissionwithdrawal.ts': 'CommissionWithdrawal.ts'
};

function fixFileCasing() {
    console.log('开始修复文件名大小写问题...\n');

    for (const [oldPath, newFileName] of Object.entries(fileMappings)) {
        const fullOldPath = path.resolve(process.cwd(), oldPath);
        const dirName = path.dirname(fullOldPath);
        const fullNewPath = path.join(dirName, newFileName);

        try {
            if (fs.existsSync(fullOldPath)) {
                // 如果目标文件已存在，先删除它
                if (fs.existsSync(fullNewPath)) {
                    fs.unlinkSync(fullNewPath);
                }
                
                // 重命名文件
                fs.renameSync(fullOldPath, fullNewPath);
                console.log(`已修复: ${oldPath} -> ${path.join(path.dirname(oldPath), newFileName)}`);
            } else {
                console.log(`文件不存在: ${oldPath}`);
            }
        } catch (error) {
            console.error(`处理文件 ${oldPath} 时出错:`, error.message);
        }
    }

    console.log('\n文件名大小写修复完成！');
}

fixFileCasing(); 