import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import Login from '../pages'
import Menu from '../pages/Menu'
import AudioRecPlay from '../pages/AudioRecPlay'

const stackRoutes = createStackNavigator()

const AppRoutes: React.FC = () => (
    <stackRoutes.Navigator
        headerMode="none"
        screenOptions={{
            cardStyle: {
                backgroundColor: 'white'
            },

        }}
    >
        <stackRoutes.Screen
            name="Login"
            component={Login}
        />
        <stackRoutes.Screen
            name="Menu"
            component={Menu}
        />
        <stackRoutes.Screen
            name="APR"
            component={AudioRecPlay}
        />
    </stackRoutes.Navigator>
)

export default AppRoutes