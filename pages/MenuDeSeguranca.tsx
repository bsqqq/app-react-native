import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import Itens from '../components/ItemMenu'

export default function MenuDeSeguranca() {
    const navigation = useNavigation()
    return (
        <SafeAreaView style={styles.container}>
            <Text>Menu De Segurança</Text>
            <View style={styles.session}>
                <Itens titulo="Inspeção" icone="shield" onPress={() => navigation.navigate('Inspecao')} />
                <Itens titulo="Check-List" icone="check" onPress={() => navigation.navigate('Checklist')}/>
                <Itens titulo="APR" icone="mic" onPress={() => navigation.navigate('APR')} />
                <Itens titulo="Laudo" icone="file" />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex'
    },
    session: {
        flex: 1,
        justifyContent: 'space-evenly',
        maxHeight: 750
    }
})