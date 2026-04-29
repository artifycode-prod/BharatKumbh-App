import 'react-native-reanimated';
import { LanguageProvider } from './src/contexts/LanguageContext';
import { RootNavigator } from './src/navigation/RootNavigator';

const App = () => {
  return (
    <LanguageProvider>
      <RootNavigator />
    </LanguageProvider>
  );
};

export default App;

