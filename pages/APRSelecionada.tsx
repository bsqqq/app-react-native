import React, { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import { StyleSheet, Text, View, Button } from 'react-native'
import fb from '../services/firebase'
import { Audio } from 'expo-av'

export default function APRSelecionada() {
    const [sound, setSound] = useState<Audio.Sound>()
    const routes = useRoute()
    const db = fb.database()

    useEffect(() => {
        async function getAPR() {
            if (sound == null) {
                const snapInspecoes = await db.ref(`/inspecoes/${routes.params?.key}`).once('value')
                const snapAPRs = await db.ref(`/APR/${routes.params?.key}`).once('value')
                const shot = snapInspecoes.val() ? snapInspecoes.val() : snapAPRs.val()
                Audio.setAudioModeAsync({
                    allowsRecordingIOS: false,
                    staysActiveInBackground: false,
                    interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
                    playsInSilentModeIOS: true,
                    shouldDuckAndroid: true,
                    interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
                    playThroughEarpieceAndroid: false
                });
                if (shot?.hiperlink) {
                    const source = { uri: shot.hiperlink }
                    const { sound } = await Audio.Sound.createAsync(source, {}, null, true)
                    setSound(sound)
                    await sound.playAsync()
                }
            }
        }
        getAPR()
        return function cleanup() {
            async function limpar() {
                await sound?.unloadAsync()
                await sound?.stopAsync()
            }
            limpar()
        }
    }, [sound]);

    async function playSound() {
        await sound?.playAsync().then(async () => sound.unloadAsync())
    }

    return (
        <View style={style.container}>
            <Text>Tocando audio...</Text>
            {
                sound
                    ? <Button title="Play" onPress={playSound} />
                    : undefined
            }
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