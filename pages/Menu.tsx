import React, { useContext } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    Button
} from 'react-native'
import Itens from '../components/ItemMenu'
import AuthContext from '../contexts/auth';
import ConexaoContext from '../contexts/conexao';
import { estouOnline } from './../utils/EstouOnline';
import { useNavigation } from '@react-navigation/native';

export default function Menu() {
    const { signOut, user } = useContext(AuthContext)
    const { conectado } = useContext(ConexaoContext)
    const navigation = useNavigation()
    estouOnline()
    return (
        <SafeAreaView style={styles.container}>
            <Text style={{
                fontSize: 20,
                fontStyle: 'italic',
                fontWeight: 'bold',
                paddingTop: 20
            }}>
                Bem Vindo(a) {user?.name}
            </Text>
            <Text>Menu Principal</Text>
            <View style={styles.session}>
                <Itens titulo="Segurança" icone="shield" onPress={() => navigation.navigate('MenuDeSeguranca')} />
                <Itens titulo="Obras" icone="briefcase" />
                <Itens titulo="Manutenção" icone="tool" />
                <Itens titulo="Frota" icone="flag" />
                {
                    !!conectado
                        ? <Text style={{
                            textAlign: 'center',
                            fontWeight: 'bold',
                            fontStyle: 'italic'
                        }}> Status: Online </Text>
                        : <Text style={{
                            textAlign: 'center',
                            fontWeight: 'bold',
                            fontStyle: 'italic'
                        }}> Status: Offline </Text>
                }
            </View>
            <Button title="Sair" onPress={() => signOut()} />
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
        maxHeight: 700
    }
})