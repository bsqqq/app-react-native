import * as React from 'react';
import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import { Providers } from './contexts/Providers'
import Routes from './routes/'
import { LogBox } from 'react-native';
import { estouOnline } from './utils/EstouOnline'

const App: React.FC = () => {
  React.useEffect(() => {
    estouOnline()
  }, [])
  LogBox.ignoreLogs(['Setting a timer for a long period of time'])
  LogBox.ignoreLogs(['componentWillReceiveProps has been renamed'])
  return (
    <NavigationContainer>
      <Providers>
        <Routes />
      </Providers>
    </NavigationContainer>
  )
}

export default App