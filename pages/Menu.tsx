import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, KeyboardAvoidingView, Platform } from 'react-native'
import Itens from '../components/ItemMenu'
export default function Menu() {
    const navigation = useNavigation()
    function handleAPR() {
        navigation.navigate('APR')
    }
    return(
        <SafeAreaView style={styles.container}>
            <Text>Tela de menu</Text>
                <View style={styles.session}>
                    <Itens titulo="Segurança" icone="shield" />
                    <Itens titulo="Obras" icone="instagram" />
                    <Itens titulo="APR" icone="mic" onPress={handleAPR}/>
                    <Itens titulo="Frota" icone="car" />
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
        justifyContent: 'space-around',
        maxHeight: 800
    }
})