/**
 * Generate Android app icons from source image
 * Run: node scripts/generate-icons-sharp.js
 * Uses sharp or jimp - install one: npm install sharp --save-dev
 */
const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '../assets/images/app-icon.png');
const androidRes = path.join(__dirname, '../android/app/src/main/res');

const sizes = [
  { folder: 'mipmap-mdpi', size: 48 },
  { folder: 'mipmap-hdpi', size: 72 },
  { folder: 'mipmap-xhdpi', size: 96 },
  { folder: 'mipmap-xxhdpi', size: 144 },
  { folder: 'mipmap-xxxhdpi', size: 192 },
];

if (!fs.existsSync(sourcePath)) {
  console.error('❌ Source icon not found:', sourcePath);
  process.exit(1);
}

async function resizeWithSharp(buffer, size) {
  const sharp = require('sharp');
  return sharp(buffer).resize(size, size).png().toBuffer();
}

async function resizeWithJimp(buffer, size) {
  const Jimp = require('jimp');
  const img = await Jimp.read(buffer);
  img.resize(size, size);
  return img.getBufferAsync('image/png');
}

async function main() {
  let resize;
  try {
    require.resolve('sharp');
    resize = resizeWithSharp;
    console.log('Using sharp...');
  } catch (e) {
    try {
      require.resolve('jimp');
      resize = resizeWithJimp;
      console.log('Using jimp...');
    } catch (e2) {
      console.error('❌ Install sharp or jimp: npm install sharp --save-dev');
      process.exit(1);
    }
  }

  console.log('🕉️  Generating Android app icons...\n');
  const buffer = fs.readFileSync(sourcePath);

  for (const { folder, size } of sizes) {
    const dir = path.join(androidRes, folder);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const outPath = path.join(dir, 'ic_launcher.png');
    const resized = await resize(buffer, size);
    fs.writeFileSync(outPath, resized);
    console.log(`   ✅ ${folder}/ic_launcher.png (${size}x${size})`);
  }

  console.log('\n🎉 Android icons generated! Rebuild the app to see changes.');
}

main().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
