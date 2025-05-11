const fs = require('fs');
const path = require('path');

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
function fixImportPaths(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // 修复相对路径导入
    const relativePathRegex = /from ['"](\.\.\/)+([^'"]+)['"]/g;
    content = content.replace(relativePathRegex, (match, dots, importPath) => {
        const parts = importPath.split('/');
        const fixedParts = parts.map(part => {
            // 保持 index.ts 为小写
            if (part === 'index.ts') return part;
            // 将目录名首字母大写
            if (part === 'middleware') return 'Middleware';
            if (part === 'models') return 'Models';
            if (part === 'routes') return 'Routes';
            if (part === 'services') return 'Services';
            if (part === 'types') return 'Types';
            if (part === 'utils') return 'Utils';
            if (part === 'validations') return 'Validations';
            if (part === 'validators') return 'Validators';
            if (part === 'controllers') return 'Controllers';
            if (part === 'config') return 'Config';
            if (part === 'database') return 'Database';
            if (part === 'engine') return 'Engine';
            if (part === 'exchanges') return 'Exchanges';
            if (part === 'clients') return 'Clients';
            if (part === 'scripts') return 'Scripts';
            // 将文件名首字母大写
            return part.charAt(0).toUpperCase() + part.slice(1);
        });
        const fixedPath = dots + fixedParts.join('/');
        modified = true;
        return `from '${fixedPath}'`;
    });
    
    // 修复本地导入
    const localImportRegex = /from ['"]\.\/([^'"]+)['"]/g;
    content = content.replace(localImportRegex, (match, importPath) => {
        const parts = importPath.split('/');
        const fixedParts = parts.map(part => {
            // 保持 index.ts 为小写
            if (part === 'index.ts') return part;
            // 将目录名首字母大写
            if (part === 'middleware') return 'Middleware';
            if (part === 'models') return 'Models';
            if (part === 'routes') return 'Routes';
            if (part === 'services') return 'Services';
            if (part === 'types') return 'Types';
            if (part === 'utils') return 'Utils';
            if (part === 'validations') return 'Validations';
            if (part === 'validators') return 'Validators';
            if (part === 'controllers') return 'Controllers';
            if (part === 'config') return 'Config';
            if (part === 'database') return 'Database';
            if (part === 'engine') return 'Engine';
            if (part === 'exchanges') return 'Exchanges';
            if (part === 'clients') return 'Clients';
            if (part === 'scripts') return 'Scripts';
            // 将文件名首字母大写
            return part.charAt(0).toUpperCase() + part.slice(1);
        });
        const fixedPath = './' + fixedParts.join('/');
        modified = true;
        return `from '${fixedPath}'`;
    });
    
    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`修复导入路径: ${filePath}`);
    }
}

// 主函数
function main() {
    const srcDir = path.join(__dirname, '..', 'src');
    const files = getAllTsFiles(srcDir);
    
    console.log(`找到 ${files.length} 个 TypeScript 文件`);
    
    let modifiedCount = 0;
    files.forEach(file => {
        try {
            fixImportPaths(file);
            modifiedCount++;
        } catch (error) {
            console.error(`处理文件 ${file} 时出错:`, error);
        }
    });
    
    console.log(`修复了 ${modifiedCount} 个文件的导入路径`);
}

main(); 