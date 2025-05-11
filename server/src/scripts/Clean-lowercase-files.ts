import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';

// 要检查的目录
const directories = [
    'src/types',
    'src/controllers',
    'src/services',
    'src/models',
    'src/routes'
];

// 要保留的文件（这些文件即使是小写也要保留）
const keepFiles = [
    'index.ts',
    'express.ts',
    'router.d.ts',
    'express.d.ts'
];

// 获取所有 TypeScript 文件
function getAllFiles() {
    const files: string[] = [];
    directories.forEach(dir => {
        const pattern = path.join(dir, '**/*.ts');
        const matches = glob.sync(pattern);
        files.push(...matches);
    });
    return files;
}

// 检查文件名是否是小写
function isLowerCaseFile(filePath: string): boolean {
    const fileName = path.basename(filePath);
    if (keepFiles.includes(fileName)) {
        return false;
    }
    return fileName === fileName.toLowerCase() && fileName !== fileName.toUpperCase();
}

// 检查是否存在对应的大写文件
function hasUpperCaseVersion(filePath: string): boolean {
    const dir = path.dirname(filePath);
    const fileName = path.basename(filePath);
    const upperCaseName = fileName.charAt(0).toUpperCase() + fileName.slice(1);
    const upperCasePath = path.join(dir, upperCaseName);
    return fs.existsSync(upperCasePath);
}

// 主函数
function main() {
    console.log('开始清理小写命名的文件...');
    
    const files = getAllFiles();
    let deletedCount = 0;
    
    files.forEach(file => {
        if (isLowerCaseFile(file) && hasUpperCaseVersion(file)) {
            try {
                fs.unlinkSync(file);
                console.log(`已删除: ${file}`);
                deletedCount++;
            } catch (error) {
                console.error(`删除文件失败 ${file}:`, error);
            }
        }
    });
    
    console.log(`\n清理完成！共删除 ${deletedCount} 个文件。`);
}

// 运行脚本
main(); 