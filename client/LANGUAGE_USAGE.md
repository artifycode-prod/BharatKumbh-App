# Language Support Guide

## How to Use Translations in Your Screens

The app now supports **English**, **Hindi (हिंदी)**, and **Marathi (मराठी)** throughout the entire application.

### Basic Usage

1. **Import the hook:**
```javascript
import { useLanguage } from '../contexts/LanguageContext';
```

2. **Use in your component:**
```javascript
export const YourScreen = () => {
  const { t } = useLanguage();
  
  return (
    <View>
      <Text>{t('kumbhMela')}</Text>
      <Text>{t('sacredServices')}</Text>
    </View>
  );
};
```

### Available Translation Keys

- `kumbhMela` - "Kumbh Mela" / "कुंभ मेला" / "कुंभ मेळा"
- `nashik2027` - "Mahakumbh Nashik 2027"
- `divineGathering` - "Divine Gathering" / "दिव्य सभा"
- `sacredServices` - "Sacred Services" / "पवित्र सेवाएं"
- `navigation` - "Navigation" / "नेविगेशन"
- `medical` - "Medical" / "चिकित्सा" / "वैद्यकीय"
- `qrCheckin` - "QR Check-in"
- `lostFound` - "Lost & Found" / "खोया और मिला"
- `emergencyAssistance` - "Emergency Assistance"
- `sos` - "SOS"
- `pressHold` - "Press & Hold for 5 seconds to activate"
- `keepHolding` - "Keep holding to activate SOS…"
- `emergencySent` - "Emergency signal sent (demo)."
- `login` - "Login" / "लॉगिन"
- `emailOrMobile` - "Email or Mobile"
- `password` - "Password" / "पासवर्ड"
- `pleaseEnterCredentials` - "Please enter login credentials"
- `continueAsGuest` - "Continue as Guest (Pilgrim)"
- `required` - "required" / "आवश्यक"

### Adding New Translations

To add new translations, edit `client/src/services/languageService.js` and add your keys to all three language objects:

```javascript
export const translations = {
  [LANGUAGES.ENGLISH]: {
    // ... existing translations
    yourNewKey: 'Your English Text',
  },
  [LANGUAGES.HINDI]: {
    // ... existing translations
    yourNewKey: 'आपका हिंदी पाठ',
  },
  [LANGUAGES.MARATHI]: {
    // ... existing translations
    yourNewKey: 'तुमचा मराठी मजकूर',
  },
};
```

### Language Selection Flow

1. App starts → Splash screen
2. Checks if language is selected
3. If not → Language Selection screen
4. User selects language → Stored in AsyncStorage
5. All screens use selected language automatically

The language preference persists across app restarts!

