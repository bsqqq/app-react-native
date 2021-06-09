import 'react-native-gesture-handler'
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { AuthProvider } from './contexts/auth'
import { InspecaoProvider } from './contexts/inspecao'
import Routes from './routes/'

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <AuthProvider>
        <InspecaoProvider>
          <Routes />
        </InspecaoProvider>
      </AuthProvider>
    </NavigationContainer>
  )
}

export default App