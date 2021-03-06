import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import AudioRecPlay from '../pages/APR'
import Menu from '../pages/Menu'
import MenuDeSeguranca from '../pages/MenuDeSeguranca'
import Inspecao from '../pages/Inspecao';
import NovaInspecao from '../pages/NovaInspecao';
import TelaDePerguntas from '../pages/telaDePerguntas'
import NaoConformidades from './../pages/NaoConformidades';
import APRSelecionada from '../pages/APRSelecionada';
import Checklist from '../pages/Checklist';
import preAPR from '../pages/preAPR';
import ListaDeAPR from '../pages/ListaDeAPR';
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
            name="APRSelecionada"
            component={APRSelecionada}
        />

        <AppStack.Screen
            name="Checklist"
            component={Checklist}
        />

        <AppStack.Screen
            name="preAPR"
            component={preAPR}
        />

        <AppStack.Screen
            name="ListaDeAPR"
            component={ListaDeAPR}
        />

        <AppStack.Screen
            name="InspecaoSelecionada"
            component={InspecaoSelecionada}
        />
        
    </AppStack.Navigator>
)

export default AppRoutes