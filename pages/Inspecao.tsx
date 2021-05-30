import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Dimensions, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import ItemInspecao from '../components/itemInspecao';
import fb from '../services/firebase'
import { InspecaoContextData } from '../contexts/inspecao';
const db = fb.database()
var inspecoesKeys: string[]
var inspecaoResolvida: InspecaoContextData

interface InspecoesDataResolvidas {
    [index: string]: InspecaoContextData
}

export default function Inspecao() {
    useEffect(() => {
        async function getInspecoes() {
            const snap = await db.ref(`/inspecoes`).once('value')
            const shot: InspecoesDataResolvidas = snap.exportVal()
            console.log(shot)
            inspecoesKeys = Object.keys(shot)
            inspecoesKeys.forEach(key => {
                console.log(shot[key])
                inspecaoResolvida = shot[key]
            })
        }
        getInspecoes()
    }, [])
    const navigation = useNavigation()
    return (
        <SafeAreaView style={style.container}>
            <ScrollView>
                <ItemInspecao
                    DataEHoraDaInspecao={ inspecaoResolvida.DataEHoraDaInspecao }
                    NumeroDeInspecao={ inspecaoResolvida.NumeroDeInspecao }
                    OT_OS_SI={ inspecaoResolvida.OT_OS_SI }
                    Inspetor={ inspecaoResolvida.Inspetor }
                    ContratoId={ inspecaoResolvida.ContratoId }
                    ProcessoId={ inspecaoResolvida.ProcessoId }
                />
            </ScrollView>
            <View style={style.buttonPosition}>
                <TouchableOpacity style={style.button} onPress={() => navigation.navigate('NovaInspeção')}>
                    <Text style={style.buttonText}>+</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 50
    },
    button: {
        backgroundColor: 'lightblue',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 40,
        height: 76,
        width: 76,
    },
    buttonText: {
        color: "white",
        fontSize: 35,
        paddingHorizontal: 21
    },
    buttonPosition: {
        position: 'absolute',
        alignSelf: 'flex-end',
        bottom: 20,
        right: 20,
    },
    cards: {
        borderRadius: 20,
        borderColor: 'black',
        borderWidth: 2,
        paddingHorizontal: Dimensions.get('window').width * 0.36,
        paddingVertical: 100,
        marginVertical: 5
    },
})