const fs = require('fs');
const path = require('path');

function isLowerCase(str) {
    return str === str.toLowerCase() && str !== str.toUpperCase();
}

function processDirectory(directory) {
    const entries = fs.readdirSync(directory, { withFileTypes: true });
    
    for (const entry of entries) {
        const fullPath = path.join(directory, entry.name);
        
        if (entry.isDirectory()) {
            processDirectory(fullPath);
        } else if (entry.isFile() && entry.name.endsWith('.ts')) {
            const dir = path.dirname(fullPath);
            const baseName = path.basename(entry.name, '.ts');
            const upperName = baseName.charAt(0).toUpperCase() + baseName.slice(1) + '.ts';
            const upperPath = path.join(dir, upperName);
            
            if (isLowerCase(baseName) && fs.existsSync(upperPath)) {
                console.log(`Removing lowercase file: ${fullPath}`);
                fs.unlinkSync(fullPath);
            }
        }
    }
}

// Start processing from src directory
const srcDir = path.join(__dirname, '..', 'src');
console.log('Cleaning lowercase files in:', srcDir);
processDirectory(srcDir);
console.log('Done cleaning lowercase files.'); 