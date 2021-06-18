import 'react-native-gesture-handler'
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { Providers } from './contexts/Providers'
import Routes from './routes/'
import { LogBox } from 'react-native';
import NetworkContext from './contexts/network';
import {estouConectado} from './utils/AmIOnline'

const App: React.FC = () => {
  // estouConectado()
  const {conectado} = React.useContext(NetworkContext)
  LogBox.ignoreLogs(['Setting a timer for a long period of time'])
  LogBox.ignoreLogs(['componentWillReceiveProps has been renamed'])
  console.log(`estou conectado? ${conectado}`)
  return (
    <NavigationContainer>
      <Providers>
        <Routes />
      </Providers>
    </NavigationContainer>
  )
}

export default App