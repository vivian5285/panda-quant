const fs = require('fs');
const path = require('path');

const updateImports = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  const updatedContent = content
    .replace(/from ['"]\.\.\/models\/User['"]/g, "from '../models/user.model'")
    .replace(/from ['"]\.\.\/\.\.\/models\/User['"]/g, "from '../../models/user.model'")
    .replace(/from ['"]\.\.\/\.\.\/\.\.\/shared\/models\/user['"]/g, "from '../../../models/user.model'")
    .replace(/import\s*{\s*IUser\s*}\s*from\s*['"]\.\.\/models\/User['"]/g, "import { IUser } from '../types/user.types'")
    .replace(/import\s*{\s*IUserDocument\s*}\s*from\s*['"]\.\.\/models\/User['"]/g, "import { IUserDocument } from '../types/user.types'");

  if (content !== updatedContent) {
    fs.writeFileSync(filePath, updatedContent);
    console.log(`Updated imports in ${filePath}`);
  }
};

const processDirectory = (dir) => {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      updateImports(filePath);
    }
  });
};

// Start processing from the src directory
const srcDir = path.join(__dirname, '..', 'src');
processDirectory(srcDir); 