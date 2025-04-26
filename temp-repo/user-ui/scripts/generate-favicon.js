import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Install required packages if not already installed
try {
  execSync('npm list svg2png png2icons', { stdio: 'ignore' });
} catch (e) {
  console.log('Installing required packages...');
  execSync('npm install svg2png png2icons --save-dev');
}

const svg2png = (await import('svg2png')).default;
const png2icons = (await import('png2icons')).default;

const inputFile = path.join(__dirname, '../public/favicon.svg');
const outputFile = path.join(__dirname, '../public/favicon.ico');

// Read SVG file
const svgBuffer = fs.readFileSync(inputFile);

// Convert SVG to PNG
svg2png(svgBuffer, { width: 32, height: 32 })
  .then(pngBuffer => {
    // Convert PNG to ICO
    const icoBuffer = png2icons.createICNS(pngBuffer, png2icons.BICUBIC, 0);
    fs.writeFileSync(outputFile, icoBuffer);
    console.log('Favicon generated successfully!');
  })
  .catch(err => {
    console.error('Error generating favicon:', err);
  }); 