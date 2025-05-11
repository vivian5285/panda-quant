import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';

// 需要修复的目录
const directories = [
    'src/controllers',
    'src/routes',
    'src/services',
    'src/models',
    'src/types',
    'src/middleware',
    'src/clients',
    'src/engine',
];

// 获取所有 ts 文件
function getAllFiles() {
    const files: string[] = [];
    directories.forEach(dir => {
        const pattern = path.join(dir, '**/*.ts');
        const matches = glob.sync(pattern);
        files.push(...matches);
    });
    return files;
}

// 修复 import 路径
function fixImportPaths(filePath: string) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // 替换 ../types/../services/XXX 为 ../services/XXX
    content = content.replace(/\.\.\/types\/\.\.\/services\//g, '../services/');
    // 替换 ../types/../controllers/XXX 为 ../controllers/XXX
    content = content.replace(/\.\.\/types\/\.\.\/controllers\//g, '../controllers/');

    if (content !== fs.readFileSync(filePath, 'utf8')) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`修复 import 路径: ${filePath}`);
        modified = true;
    }
    return modified;
}

// 检查 CommissionWithdrawal.ts 是否存在
function checkCommissionWithdrawal() {
    const filePath = path.join('src/types/CommissionWithdrawal.ts');
    if (!fs.existsSync(filePath)) {
        console.warn('警告: src/types/CommissionWithdrawal.ts 不存在，请补充该类型文件！');
    } else {
        console.log('src/types/CommissionWithdrawal.ts 存在。');
    }
}

function main() {
    console.log('开始批量修复 import 路径...');
    const files = getAllFiles();
    let count = 0;
    files.forEach(file => {
        if (fixImportPaths(file)) count++;
    });
    console.log(`\n修复完成，共修复 ${count} 个文件。`);
    checkCommissionWithdrawal();
}

main(); 