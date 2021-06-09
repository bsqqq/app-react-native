import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const NaoConformidades: React.FC = () => {
    return (
        <View style={style.container}>
            <Text>NaoConformidades.tsx</Text>
        </View>
    );
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default NaoConformidades;