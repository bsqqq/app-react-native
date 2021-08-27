import React, { useEffect, useState, useContext } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native'
import { useNavigation } from "@react-navigation/native";
import ItemAPR from '../components/itemInspecao'
import netinfo from '@react-native-community/netinfo'
import { APRProps } from './preAPR'
import fb from '../services/firebase'
import * as fs from 'expo-file-system'
import AuthContext from './../contexts/auth';

export default function ListaDeAPR() {
    const [aprs, setAprs] = useState<Array<APRProps>>([])
    var path = fs.documentDirectory + 'json/'
    const fileUri = (jsonId: string) => path + `${jsonId}.json`
    const { user } = useContext(AuthContext)
    const navigation = useNavigation()
    useEffect(() => {
        async function getAPRInfo() {
            try {
                const arrayDeAPRs: Array<APRProps> = []
                const db = fb.database()
                const snap = await db.ref('/APR').once('value')
                const shot = snap.exportVal()
                const APRsRecebidas = (await netinfo.fetch()).isConnected ? shot : JSON.parse(await fs.readAsStringAsync(fileUri('APRs')))
                const aprKeys: string[] = Object.keys(APRsRecebidas)
                var contratosKeys: string[];
                var processosKeys: string[];

                const fsContratos = JSON.parse(await fs.readAsStringAsync(fileUri('contratos')))
                const arrayDeContratos: Array<any> = [];
                contratosKeys = Object.keys(fsContratos);
                contratosKeys.forEach(key => {
                    arrayDeContratos.push(fsContratos[key]);
                });

                const fsProcessos = JSON.parse(await fs.readAsStringAsync(fileUri('processos')))
                const arrayDeProcessos: Array<any> = [];
                processosKeys = Object.keys(fsProcessos);
                processosKeys.forEach(key => {
                    arrayDeProcessos.push(fsProcessos[key]);
                });

                aprKeys.forEach(key => {
                    var apr = APRsRecebidas[key]
                    if (apr.UsuarioId === user.id) {
                        var contratoEncontrado = arrayDeContratos.find(contrato => {
                            var contratoEncontrado = Number(contrato.id) === Number(apr.ContratoId);
                            return contratoEncontrado;
                        });
                        var ProcessoEncontrado = arrayDeProcessos.find(processo => {
                            var processoEncontrado = Number(processo.id) === Number(apr.ProcessoId);
                            return processoEncontrado;
                        });
                        apr.ContratoId = contratoEncontrado ? contratoEncontrado.nome : "-";
                        apr.ProcessoId = ProcessoEncontrado ? ProcessoEncontrado.nome : "-";
                        arrayDeAPRs.push(apr);
                    }
                })
                setAprs(arrayDeAPRs)
            } catch (error) {
                console.log(error)
            }
        }
        getAPRInfo()
    }, [])
    
    return (
        <SafeAreaView style={style.container}>
            <ScrollView>
                <Text>Lista de APR</Text>
                {aprs.length > 0 ? aprs.map(item => {
                    return (
                        <ItemAPR
                            DataEHoraDaInspecao={item.DataHoraAPR}
                            OT_OS_SI={item.OT_OS_SI}
                            Inspetor={null}
                            ContratoId={item.ContratoId}
                            ProcessoId={item.ProcessoId}
                            key={item.id}
                            id={item.id}
                            redirect="APRSelecionada"
                        />
                    )
                }) : <Text style={{
                    alignItems: "center",
                    justifyContent: "center"
                }}> Não foram encontrados APR's para este usuário. </Text>}
            </ScrollView>
            <View style={style.buttonPosition}>
                <TouchableOpacity
                    style={style.button}
                    onPress={() => navigation.navigate("preAPR")}
                >
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
        marginVertical: 40
    },
    button: {
        backgroundColor: "lightblue",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 40,
        height: 76,
        width: 76,
    },
    buttonText: {
        color: "white",
        fontSize: 35,
        paddingHorizontal: 21,
    },
    buttonPosition: {
        position: "absolute",
        alignSelf: "flex-end",
        bottom: 20,
        right: 20,
    },
})