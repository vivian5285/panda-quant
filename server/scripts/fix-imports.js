const fs = require('fs');
const path = require('path');

// Get all TypeScript files
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

// Fix import paths
function fixImportPaths(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Fix relative path imports
    const relativePathRegex = /from ['"](\.\.\/)+([^'"]+)['"]/g;
    content = content.replace(relativePathRegex, (match, dots, importPath) => {
        const parts = importPath.split('/');
        const fixedParts = parts.map(part => {
            // Keep index.ts lowercase
            if (part === 'index.ts') return part;
            // Capitalize directory names
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
            // Capitalize file names
            return part.charAt(0).toUpperCase() + part.slice(1);
        });
        const fixedPath = dots + fixedParts.join('/');
        modified = true;
        return `from '${fixedPath}'`;
    });
    
    // Fix local imports
    const localImportRegex = /from ['"]\.\/([^'"]+)['"]/g;
    content = content.replace(localImportRegex, (match, importPath) => {
        const parts = importPath.split('/');
        const fixedParts = parts.map(part => {
            // Keep index.ts lowercase
            if (part === 'index.ts') return part;
            // Capitalize directory names
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
            // Capitalize file names
            return part.charAt(0).toUpperCase() + part.slice(1);
        });
        const fixedPath = './' + fixedParts.join('/');
        modified = true;
        return `from '${fixedPath}'`;
    });
    
    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed import paths: ${filePath}`);
    }
}

// Main function
function main() {
    const srcDir = path.join(__dirname, '..', 'src');
    const files = getAllTsFiles(srcDir);
    
    console.log(`Found ${files.length} TypeScript files`);
    
    let modifiedCount = 0;
    files.forEach(file => {
        try {
            fixImportPaths(file);
            modifiedCount++;
        } catch (error) {
            console.error(`Error processing file ${file}:`, error);
        }
    });
    
    console.log(`Fixed import paths in ${modifiedCount} files`);
}

main(); 