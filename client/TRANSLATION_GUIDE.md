# Translation Guide - Apply Language to All Screens

## Quick Setup for Any Screen

To add language support to any screen, follow these steps:

### 1. Import the hook
```javascript
import { useLanguage } from '../contexts/LanguageContext';
```

### 2. Use in component
```javascript
export const YourScreen = () => {
  const { t } = useLanguage();
  
  return (
    <View>
      <Text>{t('yourTranslationKey')}</Text>
    </View>
  );
};
```

### 3. Replace hardcoded text
**Before:**
```javascript
<Text>Welcome</Text>
<Text>Click here</Text>
```

**After:**
```javascript
<Text>{t('welcome')}</Text>
<Text>{t('clickHere')}</Text>
```

## Available Translation Keys

### Common UI
- `back`, `next`, `submit`, `cancel`, `save`, `delete`, `edit`
- `search`, `filter`, `refresh`, `loading`, `noData`
- `error`, `success`, `close`, `open`, `select`, `confirm`
- `yes`, `no`, `ok`, `view`, `details`

### Navigation
- `home`, `profile`, `settings`, `logout`
- `navigation`, `medical`, `qrCheckin`, `lostFound`, `sos`

### Status
- `active`, `inactive`, `pending`, `completed`

### Time
- `today`, `yesterday`, `tomorrow`

### Messages
- `noInternet`, `tryAgain`, `somethingWentWrong`

## Adding New Translations

1. Edit `client/src/services/languageService.js`
2. Add your key to all three language objects (English, Hindi, Marathi)
3. Use `t('yourKey')` in your components

## Example: Updating a Screen

**Before:**
```javascript
export const MyScreen = () => {
  return (
    <View>
      <Text>My Title</Text>
      <TouchableOpacity>
        <Text>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};
```

**After:**
```javascript
import { useLanguage } from '../contexts/LanguageContext';

export const MyScreen = () => {
  const { t } = useLanguage();
  
  return (
    <View>
      <Text>{t('myTitle')}</Text>
      <TouchableOpacity>
        <Text>{t('submit')}</Text>
      </TouchableOpacity>
    </View>
  );
};
```

Then add to `languageService.js`:
```javascript
[LANGUAGES.ENGLISH]: {
  // ... existing
  myTitle: 'My Title',
},
[LANGUAGES.HINDI]: {
  // ... existing
  myTitle: 'मेरा शीर्षक',
},
[LANGUAGES.MARATHI]: {
  // ... existing
  myTitle: 'माझे शीर्षक',
},
```

## Screens That Need Updates

All screens in `client/src/screens/` should use `useLanguage()` hook:
- Navigation.jsx
- Medical.jsx
- Lost.jsx
- SOS.jsx
- QR.jsx
- Profile.jsx
- Chatbot.jsx
- Dashboard.jsx
- All admin screens
- All volunteer screens
- All medical screens

## Testing

1. Select a language (Hindi/Marathi)
2. Navigate through all screens
3. Verify all text is translated
4. If any text is still in English, add it to translations

