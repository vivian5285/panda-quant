const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 获取所有 TypeScript 文件
function getAllTsFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            results = results.concat(getAllTsFiles(filePath));
        } else if (file.endsWith('.ts')) {
            results.push(filePath);
        }
    });
    
    return results;
}

// 修复导入路径
function fixImports(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // 修复相对路径导入
    content = content.replace(
        /from ['"](\.\.\/)+types\/([^'"]+)['"]/g,
        (match, dots, typeName) => {
            const correctTypeName = typeName.charAt(0).toUpperCase() + typeName.slice(1);
            return `from '${dots}types/${correctTypeName}'`;
        }
    );

    // 修复本地类型导入
    content = content.replace(
        /from ['"]\.\/([^'"]+)['"]/g,
        (match, typeName) => {
            const correctTypeName = typeName.charAt(0).toUpperCase() + typeName.slice(1);
            return `from './${correctTypeName}'`;
        }
    );

    if (content !== fs.readFileSync(filePath, 'utf8')) {
        fs.writeFileSync(filePath, content, 'utf8');
        modified = true;
    }

    return modified;
}

// 主函数
function main() {
    const srcDir = path.join(__dirname, '..', 'src');
    const files = getAllTsFiles(srcDir);
    let modifiedCount = 0;

    console.log('开始修复导入路径...');

    files.forEach(file => {
        if (fixImports(file)) {
            modifiedCount++;
            console.log(`已修复: ${path.relative(srcDir, file)}`);
        }
    });

    console.log(`\n完成! 共修复了 ${modifiedCount} 个文件`);
}

main(); 