import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Button } from 'react-native'
import Itens from '../components/ItemMenu'
import AuthContext from '../contexts/auth';
export default function Menu() {
    const { signOut } = useContext(AuthContext)

    const navigation = useNavigation()
    function handleAPR() {
        navigation.navigate('APR')
    }
    return(
        <SafeAreaView style={styles.container}>
            <Text>Menu Principal</Text>
                <View style={styles.session}>
                    <Itens titulo="Segurança" icone="shield" />
                    <Itens titulo="Obras" icone="instagram" />
                    <Itens titulo="APR" icone="mic" onPress={handleAPR}/>
                    <Itens titulo="Frota" icone="car" />
                </View>
                <Button title="Sair" onPress={() => signOut()}/>
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