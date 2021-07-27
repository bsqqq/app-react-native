import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";

import AudioRecPlay from '../pages/AudioRecPlay'
import Menu from '../pages/Menu'
import MenuDeSeguranca from '../pages/MenuDeSeguranca'
import Inspecao from '../pages/Inspecao';
import NovaInspecao from '../pages/NovaInspecao';
import TelaDePerguntas from '../pages/telaDePerguntas'
import NaoConformidades from './../pages/NaoConformidades';
import InspecaoSelecionada from '../pages/InspecaoSelecionada';

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

        <AppStack.Screen
            name="MenuDeSeguranca"
            component={MenuDeSeguranca}
        />

        <AppStack.Screen
            name="Inspecao"
            component={Inspecao}
        />

        <AppStack.Screen
            name="NovaInspeção"
            component={NovaInspecao}
        />
        
        <AppStack.Screen
            name="TelaDePerguntas"
            component={TelaDePerguntas}
        />

        <AppStack.Screen
            name="NaoConformidades"
            component={NaoConformidades}
        />

        <AppStack.Screen
            name="InspecaoSelecionada"
            component={InspecaoSelecionada}
        />
    </AppStack.Navigator>
)

export default AppRoutes