/**
 * Manual Icon Generation Script
 * This script provides instructions and can be used with online tools
 */

const fs = require('fs');
const path = require('path');

const sourceIconPath = path.join(__dirname, '../assets/images/app-icon.png');

console.log('🕉️  BharatKumbh App Icon Setup\n');
console.log('═══════════════════════════════════════════════════════\n');

if (!fs.existsSync(sourceIconPath)) {
  console.error('❌ Source icon not found at:', sourceIconPath);
  console.error('\nPlease place your Om symbol logo as "app-icon.png" in assets/images/\n');
  process.exit(1);
}

console.log('✅ Source icon found!\n');
console.log('📋 Manual Icon Generation Instructions:\n');
console.log('Since react-native-make is having issues, use this method:\n');
console.log('1. Go to: https://www.appicon.co/');
console.log('2. Upload your app-icon.png file');
console.log('3. Download the generated icon sets\n');
console.log('4. For Android:');
console.log('   Replace files in: android/app/src/main/res/mipmap-*/');
console.log('   - mipmap-ldpi/ic_launcher.png (36x36)');
console.log('   - mipmap-mdpi/ic_launcher.png (48x48)');
console.log('   - mipmap-hdpi/ic_launcher.png (72x72)');
console.log('   - mipmap-xhdpi/ic_launcher.png (96x96)');
console.log('   - mipmap-xxhdpi/ic_launcher.png (144x144)');
console.log('   - mipmap-xxxhdpi/ic_launcher.png (192x192)');
console.log('   Plus ic_launcher_round.png in each folder\n');
console.log('5. For iOS:');
console.log('   Replace files in: ios/BharatKumbhApp/Images.xcassets/AppIcon.appiconset/');
console.log('   - 20pt @2x (40x40)');
console.log('   - 20pt @3x (60x60)');
console.log('   - 29pt @2x (58x58)');
console.log('   - 29pt @3x (87x87)');
console.log('   - 40pt @2x (80x80)');
console.log('   - 40pt @3x (120x120)');
console.log('   - 60pt @2x (120x120)');
console.log('   - 60pt @3x (180x180)');
console.log('   - 1024x1024 (App Store)\n');
console.log('═══════════════════════════════════════════════════════\n');
console.log('💡 Alternative: Try running these commands manually:');
console.log(`   npx -y @bam.tech/react-native-make setIcon --path "${sourceIconPath}" --platform android`);
console.log(`   npx -y @bam.tech/react-native-make setIcon --path "${sourceIconPath}" --platform ios\n`);

