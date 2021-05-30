import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';

export interface itemInspecaoProps {
    DataEHoraDaInspecao: string | undefined,
    NumeroDeInspecao: number | undefined,
    OT_OS_SI: number | null | undefined,
    Inspetor: string | null | undefined,
    ContratoId: number | undefined,
    ProcessoId: number | undefined
}

const itemInspecao = ({ ...tudo } : itemInspecaoProps) => {
    return (
        <TouchableOpacity activeOpacity={0.1}>
            <View style={style.textAlign}>
                <Text>Data: </Text>
                <Text>{tudo.DataEHoraDaInspecao}</Text>
            </View>
            <View style={style.textAlign}>
                <Text>Nº de Inspeção: </Text>
                <Text>{tudo.NumeroDeInspecao}</Text>
            </View>
            <View style={style.textAlign}>
                <Text>OT / OS / SI: </Text>
                <Text>{tudo.OT_OS_SI}</Text>
            </View>
            <View style={style.textAlign}>
                <Text>Inspetor: </Text>
                <Text>{tudo.Inspetor}</Text>
            </View>
            <View style={style.textAlign}>
                <Text>Contrato: </Text>
                <Text>{tudo.ContratoId}</Text>
            </View>
            <View style={style.textAlign}>
                <Text>Processo: </Text>
                <Text>{tudo.ProcessoId}</Text>
            </View>
        </TouchableOpacity>
    )
}

const style = StyleSheet.create({
    cards: {
        borderRadius: 20,
        borderColor: 'black',
        borderWidth: 2,
        paddingHorizontal: Dimensions.get('window').width * 0.36,
        paddingVertical: 100,
        marginVertical: 5
    },
    textAlign: {
        flexDirection: 'row'
    }
})

export default itemInspecao;