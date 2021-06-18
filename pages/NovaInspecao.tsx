import React, { useState, useEffect, useContext } from 'react'
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
    Button,
    ScrollView
} from 'react-native'
import Botao from '../components/NextButton'
import fb from '../services/firebase'
import InspecaoContext from '../contexts/inspecao'
import { useNavigation } from '@react-navigation/native'
import FilterPicker, { ModalFilterPickerOption } from 'react-native-modal-filter-picker'
import municipios from '../json/municipios.json'
import processos from '../json/processos.json'
import contratos from '../json/contratos.json'
import * as Location from 'expo-location'
import AuthContext from '../contexts/auth'

interface ProcessosProps {
    [index: string]: {
        id: number,
        nome: string,
    }
}

interface objetoDeInspecao {
    id?: number | undefined,
    NumeroDeInspecao: number | undefined,
    DataEHoraDaInspecao: string | undefined,
    OT_OS_SI: number | undefined,
    MunicipioId: string | number | undefined,
    Localidade: string | undefined,
    CoordenadaX: string | number | undefined
    CoordenadaY: string | number | undefined,
    Inspetor: string | undefined,
    Placa: string | undefined,
    Equipe: string | undefined,
    ContratoId: number | undefined,
    ProcessoId: number | undefined,
}

export default function NovaInspecao() {
    const { setProcessoContratoIdContextData, setInspecaoIdContextData } = useContext(InspecaoContext)
    const [location, setLocation] = useState<Location.LocationObject>()
    const [municipioVisible, setMunicipioVisible] = useState(false)
    const [contratoVisible, setContratoVisible] = useState(false)
    const [processoVisible, setProcessoVisible] = useState(false)
    const [municipioId, setMunicipioId] = useState<number>()
    const [numInspecao, setNumInspecao] = useState<number>()
    const [contratoId, setContratoId] = useState<number>()
    const [processoId, setProcessoId] = useState<number>()
    const [localidade, setLocalidade] = useState<string>()
    const [municipio, setMunicipio] = useState<string>()
    const [processo, setProcesso] = useState<string>()
    const [contrato, setContrato] = useState<string>()
    const [dataHora, setDataHora] = useState<string>()
    const [OtOsSi, setOtOsSi] = useState<number>()
    const [equipe, setEquipe] = useState<string>()
    const [placa, setPlaca] = useState<string>()
    const { user } = useContext(AuthContext)
    const navigation = useNavigation()
    const db = fb.database()

    async function handleNewInspecao() {
        try {
            const newInspecao: objetoDeInspecao = {
                id: new Date().getTime(),
                NumeroDeInspecao: numInspecao,
                DataEHoraDaInspecao: dataHora,
                OT_OS_SI: OtOsSi,
                MunicipioId: municipioId,
                Localidade: localidade,
                CoordenadaX: location?.coords.latitude,
                CoordenadaY: location?.coords.longitude,
                Inspetor: user?.name,
                Equipe: equipe,
                Placa: placa,
                ContratoId: contratoId,
                ProcessoId: processoId
            }
            console.log(newInspecao)
            setProcessoContratoIdContextData(Number(processoId), Number(contratoId))
            setInspecaoIdContextData(Number(newInspecao.id))
            if (
                // garantir que todos os campos sejam preenchidos
                newInspecao?.Placa == undefined
                && newInspecao?.Equipe == undefined
                && newInspecao?.OT_OS_SI == undefined
                && newInspecao?.Localidade == undefined
                && newInspecao?.ContratoId == undefined
                && newInspecao?.ProcessoId == undefined
                && newInspecao?.MunicipioId == undefined
                && newInspecao?.NumeroDeInspecao == undefined
            ) {
                alert('Algum campo possivelmente está vazio, você esqueceu de preencher algum campo?')
                console.log('Erro: Algum campo possivelmente está vazio, você esqueceu de preencher algum campo?')
            } else {
                // lembrar de descomentar a linha abaixo
                // await db.ref(`/inspecoes/${newInspecao.id}`).set(newInspecao)
                navigation.navigate('TelaDePerguntas')
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const date = new Date()
        setDataHora(`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${new Date().toLocaleTimeString()}`);
        (async (): Promise<void> => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
            Location.Accuracy.Highest
        })()
    }, [])

    let municipioFormatado: ModalFilterPickerOption[] = []
    municipios.forEach(municipio => {
        municipioFormatado.push({
            key: String(municipio.id),
            label: municipio.nome
        })
    })

    const processosTipados: ProcessosProps = processos
    let processosFormatados: ModalFilterPickerOption[] = []
    const chaves: string[] = Object.keys(processosTipados)
    chaves.forEach(item => {
        processosFormatados.push({
            key: String(processosTipados[item].id),
            label: processosTipados[item].nome
        })
    })

    let contratosFormatados: ModalFilterPickerOption[] = []
    contratos.forEach(contrato => {
        contratosFormatados.push({
            key: String(contrato.id),
            label: contrato.nome
        })
    })

    return (
        <>
            <KeyboardAvoidingView behavior={Platform.OS === 'android' ? 'padding' : 'height'} style={styles.container} >
                <ScrollView>
                    <View>
                        {/*Número de inspeção precisa ser auto-incremental*/}
                        <Text style={styles.titulo}>Número da inspeção:</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType='numeric'
                            onChangeText={value => setNumInspecao(parseInt(value))}
                        />

                        <Text style={styles.titulo}>Data e hora da inspeção:</Text>
                        <TextInput
                            style={styles.input}
                            value={dataHora}
                            editable={false}
                            onChangeText={value => setDataHora(value)}
                        />

                        <Text style={styles.titulo}>OT / OS / SI:</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType='numeric'
                            onChangeText={value => setOtOsSi(parseInt(value))}
                        />

                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.titulo}>Município:</Text>
                            <Text style={{ fontStyle: 'italic', marginLeft: 10, fontSize: 20 }}>{municipio}</Text>
                        </View>
                        <View style={styles.municipioBotao}>
                            <Button
                                title="Pressione aqui para escolher o município"
                                onPress={() => setMunicipioVisible(true)}
                            />
                        </View>
                        <FilterPicker
                            visible={municipioVisible}
                            onSelect={(item: any) => {
                                console.log(item)
                                setMunicipioId(Number(item.key))
                                setMunicipio(item.label)
                                setMunicipioVisible(false)
                            }}
                            onCancel={() => setMunicipioVisible(false)}
                            options={municipioFormatado}
                        />

                        <Text style={styles.titulo}>Bairro / Localidade:</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType='default'
                            onChangeText={value => setLocalidade(value)}
                        />

                        <Text style={styles.titulo}>Placa do carro:</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType='default'
                            onChangeText={value => setPlaca(value)}
                            maxLength={7}
                        />
                        {/*O campo de colaboradores precisa ser um Multiple Select*/}
                        <Text style={styles.titulo}>Equipe:</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType='default'
                            onChangeText={value => setEquipe(value)}
                        />

                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.titulo}>Processo:</Text>
                            <Text style={{ fontStyle: 'italic', marginLeft: 10, fontSize: 20 }}>{processo}</Text>
                        </View>
                        <View style={styles.municipioBotao}>
                            <Button
                                title="Pressione aqui para escolher o processo"
                                onPress={() => setProcessoVisible(true)}
                            />
                        </View>
                        <FilterPicker
                            visible={processoVisible}
                            onSelect={(item: any) => {
                                console.log(item)
                                setProcessoId(Number(item.key))
                                setProcesso(item.label)
                                setProcessoVisible(false)
                            }}
                            onCancel={() => setProcessoVisible(false)}
                            options={processosFormatados}
                        />

                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.titulo}>Contrato:</Text>
                            <Text style={{ fontStyle: 'italic', marginLeft: 10, fontSize: 20 }}>{contrato}</Text>
                        </View>
                        <View style={styles.municipioBotao}>
                            <Button
                                title="Pressione aqui para escolher o contrato"
                                onPress={() => setContratoVisible(true)}
                            />
                        </View>
                        <FilterPicker
                            visible={contratoVisible}
                            onSelect={(item: any) => {
                                console.log(item)
                                setContratoId(Number(item.key))
                                setContrato(item.label)
                                setContratoVisible(false)
                            }}
                            onCancel={() => setContratoVisible(false)}
                            options={contratosFormatados}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
            <View style={styles.centralizarBotao}>
                <Botao texto='Iniciar' onPress={handleNewInspecao} />
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingHorizontal: 30,
        marginTop: 100,
        maxHeight: Dimensions.get('screen').height * 0.6
    },
    titulo: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5
    },
    input: {
        backgroundColor: 'lightgrey',
        paddingVertical: 3,
        width: Dimensions.get('window').width - 60,
        marginBottom: 20,
        fontStyle: 'italic'
    },
    centralizarBotao: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        maxHeight: 120,

    },
    municipioBotao: {
        marginVertical: 7,
        flexDirection: 'row'
    }
})