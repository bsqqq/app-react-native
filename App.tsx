import * as React from 'react';
import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import { Providers } from './contexts/Providers'
import Routes from './routes/'
import { LogBox } from 'react-native';
import AuthContext from './contexts/auth';
import { estouOnline } from './utils/EstouOnline';

const App: React.FC = () => {
  const { signed } = React.useContext(AuthContext)
    React.useEffect(() => {
        if (signed)
            estouOnline()
    }, [])
  LogBox.ignoreLogs(['Setting a timer for a long period of time'])
  LogBox.ignoreLogs(['componentWillReceiveProps has been renamed'])
  LogBox.ignoreLogs(['Warning: Failed child context type: Invalid child context `virtualizedCell.cellKey`'])
  return (
    <NavigationContainer>
      <Providers>
        <Routes />
      </Providers>
    </NavigationContainer>
  )
}

export default App