const fs = require('fs');
const path = require('path');

function fixImports(directory) {
    const files = fs.readdirSync(directory);
    
    files.forEach(file => {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            fixImports(fullPath);
        } else if (file.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            
            // 修复 Express 导入
            content = content.replace(/from ['"]Express['"]/g, 'from \'express\'');
            content = content.replace(/import type { ([^}]+) } from ['"]Express['"]/g, 'import type { $1 } from \'express\'');
            content = content.replace(/import { ([^}]+) } from ['"]Express['"]/g, 'import { $1 } from \'express\'');
            
            // 修复相对路径导入
            content = content.replace(/from ['"]\.\.\/types\/\.\.\/([^'"]+)['"]/g, 'from \'../$1\'');
            
            fs.writeFileSync(fullPath, content);
        }
    });
}

// 修复所有目录中的导入路径
const directories = [
    'src/controllers',
    'src/services',
    'src/types',
    'src/models',
    'src/routes',
    'src/middleware',
    'src/validations',
    'src/utils',
    'src/clients',
    'src/engine'
];

directories.forEach(dir => {
    const fullPath = path.join(__dirname, '..', dir);
    if (fs.existsSync(fullPath)) {
        console.log(`\nProcessing directory: ${dir}`);
        fixImports(fullPath);
    }
});

console.log('\nImport statements fixing completed!'); 