const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function convertSvgToPng() {
  const svgPath = path.join(__dirname, '../public/magic-ball-embed.svg');
  const pngPath = path.join(__dirname, '../public/magic-ball-embed.png');
  
  try {
    // Read SVG file
    const svgBuffer = fs.readFileSync(svgPath);
    
    // Convert SVG to PNG with 1200x630 dimensions (OG image standard)
    await sharp(svgBuffer)
      .resize(1200, 630, {
        fit: 'contain',
        background: { r: 10, g: 10, b: 15, alpha: 1 }
      })
      .png()
      .toFile(pngPath);
    
    console.log('✅ Successfully converted SVG to PNG!');
    console.log(`📁 Output: ${pngPath}`);
  } catch (error) {
    console.error('❌ Error converting SVG to PNG:', error);
    console.log('\n💡 Alternative: Use the HTML file to generate PNG manually:');
    console.log('   1. Open public/generate-embed-image.html in browser');
    console.log('   2. Right-click on canvas → Save image as...');
    console.log('   3. Save as magic-ball-embed.png in public/ folder');
    process.exit(1);
  }
}

convertSvgToPng();

