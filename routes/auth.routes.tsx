import React from 'react';
import SignIn from '../pages'

import { createStackNavigator } from "@react-navigation/stack";

const AuthStack = createStackNavigator()

const authRoutes: React.FC = () => (
    <AuthStack.Navigator>
        <AuthStack.Screen 
            name="SignIn"
            component={SignIn}
        />
    </AuthStack.Navigator>
)

export default authRoutes