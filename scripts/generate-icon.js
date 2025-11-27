const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateIcon() {
  const svgPath = path.join(__dirname, '../public/icon-magic-ball-8.svg');
  const iconPath = path.join(__dirname, '../public/icon-magic-ball-8.png');
  
  try {
    // Read SVG file
    const svgBuffer = fs.readFileSync(svgPath);
    
    // Convert SVG to PNG icon (512x512 for app icons)
    // Use square format, center the ball
    await sharp(svgBuffer)
      .resize(512, 512, {
        fit: 'contain',
        background: { r: 10, g: 10, b: 15, alpha: 1 }
      })
      .png()
      .toFile(iconPath);
    
    console.log('✅ Successfully generated icon!');
    console.log(`📁 Output: ${iconPath}`);
    console.log(`📐 Size: 512x512px`);
  } catch (error) {
    console.error('❌ Error generating icon:', error);
    process.exit(1);
  }
}

generateIcon();

