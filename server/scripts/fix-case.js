const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Function to capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Function to process a directory recursively
function processDirectory(dir) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            // Process subdirectories
            processDirectory(fullPath);
        } else if (stat.isFile() && item.endsWith('.ts')) {
            // Process TypeScript files
            const dirName = path.dirname(fullPath);
            const fileName = path.basename(fullPath);
            
            // Check if file starts with lowercase
            if (fileName[0] === fileName[0].toLowerCase()) {
                const newFileName = capitalizeFirstLetter(fileName);
                const newPath = path.join(dirName, newFileName);
                
                // Rename file using git mv
                try {
                    execSync(`git mv "${fullPath}" "${newPath}"`, { stdio: 'inherit' });
                    console.log(`Renamed: ${fullPath} -> ${newPath}`);
                } catch (error) {
                    console.error(`Error renaming ${fullPath}:`, error.message);
                }
            }
        }
    }
}

// Function to fix import paths in a file
function fixImportPaths(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Regular expression to match import statements
    const importRegex = /from\s+['"]([^'"]+)['"]/g;
    
    // Replace import paths
    content = content.replace(importRegex, (match, importPath) => {
        // Skip node_modules imports
        if (importPath.startsWith('.')) {
            const parts = importPath.split('/');
            const lastPart = parts[parts.length - 1];
            if (lastPart[0] === lastPart[0].toLowerCase()) {
                parts[parts.length - 1] = capitalizeFirstLetter(lastPart);
                return `from '${parts.join('/')}'`;
            }
        }
        return match;
    });
    
    fs.writeFileSync(filePath, content, 'utf8');
}

// Main execution
console.log('Starting case sensitivity fix...');

// Process all TypeScript files in src directory
const srcDir = path.join(__dirname, '..', 'src');
processDirectory(srcDir);

// Fix import paths in all TypeScript files
function fixAllImportPaths(dir) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            fixAllImportPaths(fullPath);
        } else if (stat.isFile() && item.endsWith('.ts')) {
            fixImportPaths(fullPath);
            console.log(`Fixed imports in: ${fullPath}`);
        }
    }
}

fixAllImportPaths(srcDir);

console.log('Case sensitivity fix completed!'); 