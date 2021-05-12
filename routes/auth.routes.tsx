import React from 'react';
import SignIn from '../pages'

import { createStackNavigator } from "@react-navigation/stack";

const AuthStack = createStackNavigator()

const authRoutes: React.FC = () => (
    <AuthStack.Navigator headerMode='none'>
        <AuthStack.Screen 
            name="Login"
            component={SignIn}
        />
    </AuthStack.Navigator>
)

export default authRoutes