# Clear Language Selection for Testing

If the language selection screen is not showing, it might be because a language was already selected and stored in AsyncStorage.

## To Reset Language Selection:

### Option 1: Clear App Data (Recommended for Testing)
- **Android**: Settings → Apps → BharatKumbh → Storage → Clear Data
- **iOS**: Delete and reinstall the app

### Option 2: Add Temporary Reset Code
Add this to your code temporarily to clear language:

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';
// Clear language
AsyncStorage.removeItem('app_language');
```

### Option 3: Check Current Language
You can check if language is set by adding this in your code:

```javascript
import { getLanguage, hasLanguageSelected } from './src/services/languageService';

// Check language
const lang = await getLanguage();
const selected = await hasLanguageSelected();
console.log('Current language:', lang);
console.log('Language selected:', selected);
```

The language selection screen should appear automatically on first launch when no language is set.

