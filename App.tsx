import * as React from 'react';
import 'react-native-gesture-handler'
import Constants from 'expo-constants'
import { NavigationContainer } from '@react-navigation/native'
import { Providers } from './contexts/Providers'
import Routes from './routes/'
import { LogBox } from 'react-native';
import { estouOnline } from './utils/EstouOnline'
import * as Notifications from 'expo-notifications'

const App: React.FC = () => {
  const [expoPushToken, setExpoPushToken] = React.useState<string>()
  React.useEffect(() => {
    estouOnline()
    async function getPermissionsAndToken(): Promise<string> {
      if (Constants.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync()
        let finalStatus = existingStatus
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync()
          finalStatus = status
        }
      }
      if (status != 'granted') {
        alert('Falha ao receber permissões de notificações')
        return ''
      }
      const token = (await Notifications.getExpoPushTokenAsync()).data
      return token
    }
    getPermissionsAndToken().then(token => setExpoPushToken(token))
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