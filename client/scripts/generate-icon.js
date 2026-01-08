/**
 * Script to generate app icons from a source image
 * 
 * Usage:
 * 1. Place your Om symbol logo as 'app-icon.png' (1024x1024px) in the client/assets/images/ directory
 * 2. Run: npm run generate-icon
 * 
 * This will generate all required icon sizes for both Android and iOS
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const sourceIconPath = path.join(__dirname, '../assets/images/app-icon.png');

console.log('🕉️  Generating App Icons for BharatKumbh...\n');

// Check if source icon exists
if (!fs.existsSync(sourceIconPath)) {
  console.error('❌ Error: Source icon not found!');
  console.error(`   Expected location: ${sourceIconPath}`);
  console.error('\n📝 Instructions:');
  console.error('   1. Save your Om symbol logo as "app-icon.png"');
  console.error('   2. Image should be 1024x1024 pixels (square)');
  console.error('   3. Place it in: client/assets/images/app-icon.png');
  console.error('   4. Run this script again: npm run generate-icon\n');
  process.exit(1);
}

console.log('✅ Source icon found!\n');

try {
  // Try using react-native-make with proper command
  console.log('📱 Generating Android icons...');
  try {
    execSync(
      `npx -y @bam.tech/react-native-make setIcon --path "${sourceIconPath}" --platform android`,
      { stdio: 'inherit', cwd: path.join(__dirname, '..') }
    );
    console.log('✅ Android icons generated!\n');
  } catch (androidError) {
    console.log('⚠️  react-native-make failed, trying alternative method...\n');
    throw androidError;
  }

  // Generate iOS icons
  console.log('🍎 Generating iOS icons...');
  execSync(
    `npx -y @bam.tech/react-native-make setIcon --path "${sourceIconPath}" --platform ios`,
    { stdio: 'inherit', cwd: path.join(__dirname, '..') }
  );
  console.log('✅ iOS icons generated!\n');

  console.log('🎉 All app icons have been generated successfully!');
  console.log('\n📝 Next steps:');
  console.log('   - Rebuild your app to see the new icons');
  console.log('   - For Android: npm run android');
  console.log('   - For iOS: npm run ios\n');

} catch (error) {
  console.error('❌ Error generating icons:', error.message);
  console.error('\n💡 Alternative Solutions:');
  console.error('\n1. Use online tool (Recommended):');
  console.error('   - Go to: https://www.appicon.co/');
  console.error('   - Upload your app-icon.png');
  console.error('   - Download Android and iOS icon sets');
  console.error('   - Replace files in:');
  console.error('     • Android: android/app/src/main/res/mipmap-*/');
  console.error('     • iOS: ios/BharatKumbhApp/Images.xcassets/AppIcon.appiconset/');
  console.error('\n2. Try manual command:');
  console.error(`   npx -y @bam.tech/react-native-make setIcon --path "${sourceIconPath}" --platform android`);
  console.error(`   npx -y @bam.tech/react-native-make setIcon --path "${sourceIconPath}" --platform ios\n`);
  process.exit(1);
}

