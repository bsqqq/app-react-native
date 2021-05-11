import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";

import AudioRecPlay from '../pages/AudioRecPlay'
import Menu from '../pages/Menu'

const AppStack = createStackNavigator()

const AppRoutes: React.FC = () => (
    <AppStack.Navigator 
    headerMode="none"
    screenOptions={{
        cardStyle: {
            backgroundColor: 'white'
        },
    }}>
        <AppStack.Screen 
            name="Menu"
            component={Menu}
        />
        
        <AppStack.Screen
            name="APR"
            component={AudioRecPlay}
        />
    </AppStack.Navigator>
)

export default AppRoutes