const fs = require('fs');
const path = require('path');

const serverDir = path.join(__dirname, 'src');

function fixImports(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const newContent = content.replace(/from ['"]\.\.\/interfaces\/([^'"]+)['"]/g, 'from \'../types/$1\'');
  fs.writeFileSync(filePath, newContent);
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.ts')) {
      fixImports(filePath);
    }
  }
}

walkDir(serverDir);
console.log('Import paths have been fixed.'); 