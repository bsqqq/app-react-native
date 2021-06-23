import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Button } from 'react-native'
import Itens from '../components/ItemMenu'
import AuthContext from '../contexts/auth';
import { estouOnline } from './../utils/EstouOnline';

export default function Menu() {
    const { signOut, user } = useContext(AuthContext)
    const navigation = useNavigation()
    const status = estouOnline()
    return (
        <SafeAreaView style={styles.container}>
            <Text style={{ fontSize: 20, fontStyle: 'italic', fontWeight: 'bold' }}>Bem Vindo(a) {user?.name}</Text>
            <Text>Menu Principal</Text>
            <View style={styles.session}>
                <Itens titulo="Segurança" icone="shield" onPress={() => navigation.navigate('MenuDeSeguranca')} />
                <Itens titulo="Obras" icone="instagram" />
                <Itens titulo="Manutenção" icone="tools" />
                <Itens titulo="Frota" icone="globe" />
            </View>
            <Button title="Sair" onPress={() => signOut()} />
            {
                status
                    ? <Text>Status: Online</Text>
                    : <Text>Status: Offline</Text>
            }
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
        maxHeight: 720
    }
})