const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateHero() {
  const svgPath = path.join(__dirname, '../public/icon-magic-ball-infinity.svg');
  const heroPath = path.join(__dirname, '../public/hero-magic-ball-infinity.png');
  
  try {
    // Read SVG file
    const svgBuffer = fs.readFileSync(svgPath);
    
    // Convert SVG to PNG hero image (1200x630 for hero/splash)
    await sharp(svgBuffer)
      .resize(1200, 630, {
        fit: 'contain',
        background: { r: 10, g: 10, b: 15, alpha: 1 }
      })
      .png()
      .toFile(heroPath);
    
    console.log('✅ Successfully generated hero image!');
    console.log(`📁 Output: ${heroPath}`);
    console.log(`📐 Size: 1200x630px`);
  } catch (error) {
    console.error('❌ Error generating hero image:', error);
    process.exit(1);
  }
}

generateHero();

