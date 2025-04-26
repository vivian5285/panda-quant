import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const convertSvgToPng = async (svgPath, pngPath, size) => {
  try {
    const svgBuffer = fs.readFileSync(svgPath);
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(pngPath);
    console.log(`Converted ${svgPath} to ${pngPath}`);
  } catch (error) {
    console.error(`Error converting ${svgPath}:`, error);
  }
};

const main = async () => {
  const publicDir = path.join(__dirname, '../public');
  
  // Convert logo and hero
  await convertSvgToPng(
    path.join(publicDir, 'panda-logo.svg'),
    path.join(publicDir, 'panda-logo.png'),
    200
  );
  
  await convertSvgToPng(
    path.join(publicDir, 'panda-hero.svg'),
    path.join(publicDir, 'panda-hero.png'),
    400
  );
  
  // Convert exchange logos
  const exchanges = ['binance', 'okx', 'huobi', 'bybit', 'gate', 'kucoin'];
  for (const exchange of exchanges) {
    await convertSvgToPng(
      path.join(publicDir, 'exchanges', `${exchange}.svg`),
      path.join(publicDir, 'exchanges', `${exchange}.png`),
      200
    );
  }
};

main().catch(console.error); 