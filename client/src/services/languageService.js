/**
 * Language Service
 * Handles language preference storage and retrieval
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const LANGUAGE_KEY = 'app_language';

export const LANGUAGES = {
  ENGLISH: 'English',
  HINDI: 'हिंदी',
  MARATHI: 'मराठी'
};

/**
 * Get stored language preference
 */
export const getLanguage = async () => {
  try {
    const language = await AsyncStorage.getItem(LANGUAGE_KEY);
    return language; // Return null if not set
  } catch (error) {
    console.error('Error getting language:', error);
    return null;
  }
};

/**
 * Check if language has been selected
 */
export const hasLanguageSelected = async () => {
  try {
    const language = await AsyncStorage.getItem(LANGUAGE_KEY);
    
    // Check if language exists and is valid
    let result = false;
    if (language) {
      const trimmed = language.trim();
      // Check if it's one of our valid languages (exact match)
      const validLanguages = [LANGUAGES.ENGLISH, LANGUAGES.HINDI, LANGUAGES.MARATHI];
      result = trimmed !== '' && validLanguages.some(lang => lang === trimmed);
      
      // Additional check: verify it's a valid language string
      if (result) {
        console.log('✅ Valid language found:', trimmed);
      } else {
        console.log('⚠️ Language found but not valid:', trimmed, 'Valid options:', validLanguages);
      }
    } else {
      console.log('⚠️ No language found in AsyncStorage');
    }
    
    console.log('🔍 hasLanguageSelected check:', { 
      language, 
      result,
      isValid: result,
      isNull: language === null,
      isEmpty: language === '' || language?.trim() === '',
      validLanguages: [LANGUAGES.ENGLISH, LANGUAGES.HINDI, LANGUAGES.MARATHI]
    });
    
    return result;
  } catch (error) {
    console.error('❌ Error checking language:', error);
    return false;
  }
};

/**
 * Clear language selection (for testing/reset)
 */
export const clearLanguage = async () => {
  try {
    await AsyncStorage.removeItem(LANGUAGE_KEY);
    console.log('✅ Language cleared');
    return true;
  } catch (error) {
    console.error('Error clearing language:', error);
    return false;
  }
};

/**
 * Set language preference
 */
export const setLanguage = async (language) => {
  try {
    if (!language || language.trim() === '') {
      console.error('❌ Cannot set empty language');
      return false;
    }
    
    await AsyncStorage.setItem(LANGUAGE_KEY, language);
    
    // Verify it was saved
    const verified = await AsyncStorage.getItem(LANGUAGE_KEY);
    if (verified === language) {
      console.log('✅ Language saved and verified:', language);
      return true;
    } else {
      console.error('❌ Language save verification failed:', { expected: language, got: verified });
      return false;
    }
  } catch (error) {
    console.error('❌ Error setting language:', error);
    return false;
  }
};

/**
 * Translations for different languages
 */
export const translations = {
  [LANGUAGES.ENGLISH]: {
    selectLanguage: 'Select Your Language',
    continue: 'Continue',
    login: 'Login',
    emailOrMobile: 'Email or Mobile',
    password: 'Password',
    pleaseEnterCredentials: 'Please enter login credentials',
    forgotPassword: 'Forgot your Password?',
    continueAsGuest: 'Continue as Guest (Pilgrim)',
    required: 'required',
    kumbhMela: 'Kumbh Mela',
    nashik2027: 'Mahakumbh Nashik 2027',
    divineGathering: 'Divine Gathering',
    sacredServices: 'Sacred Services',
    navigation: 'Navigation',
    medical: 'Medical',
    qrCheckin: 'QR Check-in',
    lostFound: 'Lost & Found',
    emergencyAssistance: 'Emergency Assistance',
    sos: 'SOS',
    pressHold: 'Press & Hold for 5 seconds to activate',
    keepHolding: 'Keep holding to activate SOS…',
    emergencySent: 'Emergency signal sent (demo).',
    // Common UI
    back: 'Back',
    next: 'Next',
    submit: 'Submit',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    search: 'Search',
    filter: 'Filter',
    refresh: 'Refresh',
    loading: 'Loading...',
    noData: 'No data available',
    error: 'Error',
    success: 'Success',
    // Navigation
    home: 'Home',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Logout',
    // Common actions
    view: 'View',
    details: 'Details',
    close: 'Close',
    open: 'Open',
    select: 'Select',
    confirm: 'Confirm',
    yes: 'Yes',
    no: 'No',
    ok: 'OK',
    // Status
    active: 'Active',
    inactive: 'Inactive',
    pending: 'Pending',
    completed: 'Completed',
    // Time
    today: 'Today',
    yesterday: 'Yesterday',
    tomorrow: 'Tomorrow',
    // Common messages
    noInternet: 'No internet connection',
    tryAgain: 'Try again',
    somethingWentWrong: 'Something went wrong',
    // Profile
    user: 'User',
    emailPhone: 'Email/Phone',
    role: 'Role',
    pilgrim: 'Pilgrim',
    volunteer: 'Volunteer',
    admin: 'Admin',
    medicalTeam: 'Medical Team',
    refreshProfile: 'Refresh Profile',
    signOut: 'Sign Out',
    signOutConfirm: 'Are you sure you want to sign out?',
    notSet: 'Not set',
    // Common labels
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    // Home Screen
    mahaKumbh2027: 'Maha Kumbh 2027',
    attractionsAroundNashik: 'Attractions around Nashik',
    exploreSacredPlaces: 'Explore sacred places and holy sites',
    tasteOfNashik: 'Taste of Nashik',
    discoverLocalDelicacies: 'Discover local delicacies and street food',
    divineAssistant: 'Divine Assistant',
    selectQuestionBelow: "Namaste! I'm your divine assistant. Select a question below:",
    quickQuestions: 'Quick Questions:',
    fullAssistant: 'Full Assistant',
    eatOnlyCleanStalls: 'Eat only at clean, authorized stalls near ghats',
    // Attraction Detail Screen
    attractionNotFound: 'Attraction not found',
    fromNashik: 'from Nashik',
    aboutThisPlace: 'About this Place',
    attractionDescription: '{name} is one of the most significant spiritual destinations in Nashik. This sacred site holds immense importance for devotees visiting during the Maha Kumbh Mela. Experience the divine atmosphere and connect with the rich cultural heritage of this holy place.',
    visitingInformation: 'Visiting Information',
    timings: 'Timings',
    open24Hours: 'Open 24 hours during Kumbh Mela',
    transport: 'Transport',
    shuttleServiceAvailable: 'Shuttle service available from main ghat',
    bestTime: 'Best Time',
    bestTimeForDarshan: 'Early morning or evening for peaceful darshan',
  },
  [LANGUAGES.HINDI]: {
    selectLanguage: 'अपनी भाषा चुनें',
    continue: 'जारी रखें',
    login: 'लॉगिन',
    emailOrMobile: 'ईमेल या मोबाइल',
    password: 'पासवर्ड',
    pleaseEnterCredentials: 'कृपया लॉगिन क्रेडेंशियल दर्ज करें',
    forgotPassword: 'पासवर्ड भूल गए?',
    continueAsGuest: 'अतिथि के रूप में जारी रखें (तीर्थयात्री)',
    required: 'आवश्यक',
    kumbhMela: 'कुंभ मेला',
    nashik2027: 'महाकुम्भ नासिक 2027',
    divineGathering: 'दिव्य सभा',
    sacredServices: 'पवित्र सेवाएं',
    navigation: 'नेविगेशन',
    medical: 'चिकित्सा',
    qrCheckin: 'QR चेक-इन',
    lostFound: 'खोया और मिला',
    emergencyAssistance: 'आपातकालीन सहायता',
    sos: 'SOS',
    pressHold: 'सक्रिय करने के लिए 5 सेकंड तक दबाए रखें',
    keepHolding: 'SOS सक्रिय करने के लिए दबाए रखें…',
    emergencySent: 'आपातकालीन संकेत भेजा गया (डेमो)।',
    // Common UI
    back: 'वापस',
    next: 'अगला',
    submit: 'जमा करें',
    cancel: 'रद्द करें',
    save: 'सहेजें',
    delete: 'हटाएं',
    edit: 'संपादित करें',
    search: 'खोजें',
    filter: 'फ़िल्टर',
    refresh: 'ताज़ा करें',
    loading: 'लोड हो रहा है...',
    noData: 'कोई डेटा उपलब्ध नहीं',
    error: 'त्रुटि',
    success: 'सफल',
    // Navigation
    home: 'होम',
    profile: 'प्रोफ़ाइल',
    settings: 'सेटिंग्स',
    logout: 'लॉगआउट',
    // Common actions
    view: 'देखें',
    details: 'विवरण',
    close: 'बंद करें',
    open: 'खोलें',
    select: 'चुनें',
    confirm: 'पुष्टि करें',
    yes: 'हाँ',
    no: 'नहीं',
    ok: 'ठीक है',
    // Status
    active: 'सक्रिय',
    inactive: 'निष्क्रिय',
    pending: 'लंबित',
    completed: 'पूर्ण',
    // Time
    today: 'आज',
    yesterday: 'कल',
    tomorrow: 'कल',
    // Common messages
    noInternet: 'कोई इंटरनेट कनेक्शन नहीं',
    tryAgain: 'पुनः प्रयास करें',
    somethingWentWrong: 'कुछ गलत हो गया',
    // Profile
    user: 'उपयोगकर्ता',
    emailPhone: 'ईमेल/फोन',
    role: 'भूमिका',
    pilgrim: 'तीर्थयात्री',
    volunteer: 'स्वयंसेवक',
    admin: 'व्यवस्थापक',
    medicalTeam: 'चिकित्सा टीम',
    refreshProfile: 'प्रोफ़ाइल ताज़ा करें',
    signOut: 'साइन आउट',
    signOutConfirm: 'क्या आप वाकई साइन आउट करना चाहते हैं?',
    notSet: 'सेट नहीं',
    // Common labels
    name: 'नाम',
    email: 'ईमेल',
    phone: 'फोन',
    // Home Screen
    mahaKumbh2027: 'महा कुंभ 2027',
    attractionsAroundNashik: 'नासिक के आसपास के आकर्षण',
    exploreSacredPlaces: 'पवित्र स्थानों और पवित्र स्थलों का अन्वेषण करें',
    tasteOfNashik: 'नासिक का स्वाद',
    discoverLocalDelicacies: 'स्थानीय व्यंजन और स्ट्रीट फूड खोजें',
    divineAssistant: 'दिव्य सहायक',
    selectQuestionBelow: 'नमस्ते! मैं आपका दिव्य सहायक हूं। नीचे एक प्रश्न चुनें:',
    quickQuestions: 'त्वरित प्रश्न:',
    fullAssistant: 'पूर्ण सहायक',
    eatOnlyCleanStalls: 'केवल घाटों के पास स्वच्छ, अधिकृत स्टॉल पर खाएं',
    // Attraction Detail Screen
    attractionNotFound: 'आकर्षण नहीं मिला',
    fromNashik: 'नासिक से',
    aboutThisPlace: 'इस स्थान के बारे में',
    attractionDescription: '{name} नासिक के सबसे महत्वपूर्ण आध्यात्मिक स्थलों में से एक है। यह पवित्र स्थल महा कुंभ मेला के दौरान आने वाले भक्तों के लिए अत्यधिक महत्व रखता है। दिव्य वातावरण का अनुभव करें और इस पवित्र स्थान की समृद्ध सांस्कृतिक विरासत से जुड़ें।',
    visitingInformation: 'यात्रा की जानकारी',
    timings: 'समय',
    open24Hours: 'कुंभ मेला के दौरान 24 घंटे खुला',
    transport: 'परिवहन',
    shuttleServiceAvailable: 'मुख्य घाट से शटल सेवा उपलब्ध',
    bestTime: 'सर्वोत्तम समय',
    bestTimeForDarshan: 'शांत दर्शन के लिए सुबह जल्दी या शाम',
  },
  [LANGUAGES.MARATHI]: {
    selectLanguage: 'तुमची भाषा निवडा',
    continue: 'सुरू ठेवा',
    login: 'लॉगिन',
    emailOrMobile: 'ईमेल किंवा मोबाइल',
    password: 'पासवर्ड',
    pleaseEnterCredentials: 'कृपया लॉगिन क्रेडेंशियल प्रविष्ट करा',
    forgotPassword: 'पासवर्ड विसरलात?',
    continueAsGuest: 'अतिथी म्हणून सुरू ठेवा (तीर्थयात्री)',
    required: 'आवश्यक',
    kumbhMela: 'कुंभ मेळा',
    nashik2027: 'महाकुम्भ नाशिक 2027',
    divineGathering: 'दिव्य सभा',
    sacredServices: 'पवित्र सेवा',
    navigation: 'नेव्हिगेशन',
    medical: 'वैद्यकीय',
    qrCheckin: 'QR चेक-इन',
    lostFound: 'हरवले आणि सापडले',
    emergencyAssistance: 'आपत्कालीन मदत',
    sos: 'SOS',
    pressHold: 'सक्रिय करण्यासाठी 5 सेकंद दाबून ठेवा',
    keepHolding: 'SOS सक्रिय करण्यासाठी दाबून ठेवा…',
    emergencySent: 'आपत्कालीन सिग्नल पाठवला (डेमो)।',
    // Common UI
    back: 'मागे',
    next: 'पुढे',
    submit: 'सबमिट करा',
    cancel: 'रद्द करा',
    save: 'जतन करा',
    delete: 'हटवा',
    edit: 'संपादन करा',
    search: 'शोधा',
    filter: 'फिल्टर',
    refresh: 'रिफ्रेश करा',
    loading: 'लोड होत आहे...',
    noData: 'डेटा उपलब्ध नाही',
    error: 'त्रुटी',
    success: 'यशस्वी',
    // Navigation
    home: 'होम',
    profile: 'प्रोफाइल',
    settings: 'सेटिंग्ज',
    logout: 'लॉगआउट',
    // Common actions
    view: 'पहा',
    details: 'तपशील',
    close: 'बंद करा',
    open: 'उघडा',
    select: 'निवडा',
    confirm: 'पुष्टी करा',
    yes: 'होय',
    no: 'नाही',
    ok: 'ठीक आहे',
    // Status
    active: 'सक्रिय',
    inactive: 'निष्क्रिय',
    pending: 'प्रलंबित',
    completed: 'पूर्ण',
    // Time
    today: 'आज',
    yesterday: 'काल',
    tomorrow: 'उद्या',
    // Common messages
    noInternet: 'इंटरनेट कनेक्शन नाही',
    tryAgain: 'पुन्हा प्रयत्न करा',
    somethingWentWrong: 'काहीतरी चुकीचे झाले',
    // Profile
    user: 'वापरकर्ता',
    emailPhone: 'ईमेल/फोन',
    role: 'भूमिका',
    pilgrim: 'तीर्थयात्री',
    volunteer: 'स्वयंसेवक',
    admin: 'प्रशासक',
    medicalTeam: 'वैद्यकीय संघ',
    refreshProfile: 'प्रोफाइल रिफ्रेश करा',
    signOut: 'साइन आउट',
    signOutConfirm: 'तुम्हाला खरोखर साइन आउट करायचे आहे?',
    notSet: 'सेट नाही',
    // Common labels
    name: 'नाव',
    email: 'ईमेल',
    phone: 'फोन',
    // Home Screen
    mahaKumbh2027: 'महा कुंभ 2027',
    attractionsAroundNashik: 'नाशिकच्या आसपासचे आकर्षण',
    exploreSacredPlaces: 'पवित्र ठिकाणे आणि पवित्र स्थळे एक्सप्लोर करा',
    tasteOfNashik: 'नाशिकचा चव',
    discoverLocalDelicacies: 'स्थानिक व्यंजने आणि स्ट्रीट फूड शोधा',
    divineAssistant: 'दिव्य सहाय्यक',
    selectQuestionBelow: 'नमस्कार! मी तुमचा दिव्य सहाय्यक आहे. खाली एक प्रश्न निवडा:',
    quickQuestions: 'त्वरित प्रश्न:',
    fullAssistant: 'पूर्ण सहाय्यक',
    eatOnlyCleanStalls: 'फक्त घाटांजवळ स्वच्छ, अधिकृत स्टॉलवर खा',
  },
};

/**
 * Get translation for current language
 */
export const getTranslation = async (key) => {
  const language = await getLanguage();
  const lang = language || LANGUAGES.ENGLISH;
  return translations[lang]?.[key] || translations[LANGUAGES.ENGLISH][key] || key;
};

/**
 * Get all translations for current language (synchronous version using stored language)
 */
export const getTranslations = async () => {
  const language = await getLanguage();
  const lang = language || LANGUAGES.ENGLISH;
  return translations[lang] || translations[LANGUAGES.ENGLISH];
};

