/**
 * Utility to test language selection
 * Run this in your app console or add to a test screen
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearLanguage, getLanguage, hasLanguageSelected } from '../services/languageService';

export const testLanguageSelection = async () => {
  console.log('🧪 Testing Language Selection...');
  
  // Check current state
  const currentLang = await getLanguage();
  const isSelected = await hasLanguageSelected();
  
  console.log('Current state:', {
    language: currentLang,
    isSelected: isSelected,
    allKeys: await AsyncStorage.getAllKeys()
  });
  
  // Clear language to test
  await clearLanguage();
  console.log('✅ Language cleared');
  
  // Check again
  const afterClear = await hasLanguageSelected();
  console.log('After clear - isSelected:', afterClear);
  
  return {
    before: { language: currentLang, isSelected },
    after: { isSelected: afterClear }
  };
};

// To use: import and call testLanguageSelection() in your app

