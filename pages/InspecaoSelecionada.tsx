import React, { useEffect } from 'react'
import { useRoute } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native'
import fb from '../services/firebase'

export default function InspecaoSelecionada() {
    const routes = useRoute()
    const db = fb.database()
    useEffect(() => {
        async function getInspecoes() {
            const snap = await db.ref('/inspecoes').once('value')
            const shot = snap.exportVal()
            const keys = Object.keys(shot)
            keys.forEach(key => {
                console.log(Number(key) == Number(routes.params?.key) ? shot[key] : '')
            })
        }
        getInspecoes()
    }, [])

    return (
        <View style={style.container}>
            <Text>InspecaoSelecionada.tsx</Text>
            <Text>id: {routes.params?.key}</Text>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})