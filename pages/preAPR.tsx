import React, { useState, useContext, useEffect } from 'react'
import { View, StyleSheet, Text, KeyboardAvoidingView, ScrollView, Platform, TextInput, Button, Dimensions } from 'react-native'
import FilterPicker, { ModalFilterPickerOption } from 'react-native-modal-filter-picker'
import Botao from '../components/NextButton'
import * as Location from 'expo-location'
import MultiSelect from 'expo-multiple-select'
import APRContext from './../contexts/apr';
import { useNavigation } from '@react-navigation/native'
import * as fs from 'expo-file-system'
import AuthContext from '../contexts/auth'

interface ProcessosProps {
    [index: string]: {
        id: number,
        nome: string,
    }
}

interface MultiProps {
    id: string,
    name: string
}

interface ContratoProps {
    [index: string]: {
        id: string,
        nome: string
    }
}

interface ColaboradoresProps {
    [index: string]: {
        admissao: string,
        cpf: string,
        email?: string,
        empresaId: number,
        funcaoId: number,
        id: number,
        matricula: string,
        minhaParceria: boolean,
        nome: string,
        status: number,
        totalDocs: number,
        web: boolean,
        senha?: string
    }
}

export interface APRProps {
    id: number,
    DataHoraAPR: string,
    OT_OS_SI: number,
    ProcessoId: number,
    ContratoId: number,
    EquipeId: Array<number>,
    UsuarioId: number,
    CoordenadaX: number,
    CoordenadaY: number
}

export default function preAPR() {
    const { setNewAPRContext } = useContext(APRContext)
    var path = fs.documentDirectory + 'json/'
    const fileUri = (jsonId: string) => path + `${jsonId}.json`
    const [colaboradoresFormatados, setColaboradoresFormatados] = useState<MultiProps[]>([])
    const [processosState, setProcessosState] = useState<ProcessosProps>({})
    const [contratosState, setContratosState] = useState<ContratoProps>({})
    const [location, setLocation] = useState<Location.LocationObject>()
    const [contratoVisible, setContratoVisible] = useState(false)
    const [processoVisible, setProcessoVisible] = useState(false)
    const [contratoId, setContratoId] = useState<number>()
    const [processoId, setProcessoId] = useState<number>()
    const [equipeId, setEquipeId] = useState<number[]>([])
    const [processo, setProcesso] = useState<string>()
    const [contrato, setContrato] = useState<string>()
    const [dataHora, setDataHora] = useState<string>()
    const [OtOsSi, setOtOsSi] = useState<number>()
    const { user } = useContext(AuthContext)
    const navigation = useNavigation()
    var colaboradores: ColaboradoresProps
    var processos: ProcessosProps
    var contratos: ContratoProps = {}

    useEffect(() => {
        let colaboradoresFormatadosPreState: MultiProps[] = []
        const date = new Date()
        setDataHora(`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${new Date().toLocaleTimeString()}`);

        (async (): Promise<void> => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                return;
            }
            let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
            setLocation(location);
            colaboradores = JSON.parse(await fs.readAsStringAsync(fileUri('colaboradores')))
            const keys: string[] = Object.keys(colaboradores)
            keys.forEach(item => {
                colaboradoresFormatadosPreState.push({
                    id: String(colaboradores[item].id),
                    name: colaboradores[item].nome
                })
            })
            setColaboradoresFormatados(colaboradoresFormatadosPreState)
        })();

        (async (): Promise<void> => {
            processos = JSON.parse(await fs.readAsStringAsync(fileUri('processos')))
            setProcessosState(processos)
            contratos = JSON.parse(await fs.readAsStringAsync(fileUri('contratos')))
            setContratosState(contratos)
        })()
    }, [])

    const processosTipados: ProcessosProps = processosState
    let processosFormatados: ModalFilterPickerOption[] = []
    const chaves: string[] = Object.keys(processosTipados)
    chaves.forEach(item => {
        processosFormatados.push({
            key: String(processosTipados[item].id),
            label: processosTipados[item].nome
        })
    })

    const contratosTipados: ContratoProps = contratosState
    let contratosFormatados: ModalFilterPickerOption[] = []
    const keys: string[] = Object.keys(contratosTipados)
    keys?.forEach(item => {
        contratosFormatados.push({
            key: String(contratosTipados[item].id),
            label: contratosTipados[item].nome
        })
    })

    function newAPR() {
        if (
            Number(OtOsSi?.toString().length) <= 0
            || Number(contratoId?.toString().length) <= 0
            || Number(processoId?.toString().length) <= 0
            || equipeId.length < 0
            || !user.id
        ) {
            alert("Algum dos campos acima não foram preenchidos, por favor verifique e tente novamente.")
            return false
        }
        const objetoDeAPR: APRProps = {
            id: new Date().getTime(),
            DataHoraAPR: String(dataHora),
            OT_OS_SI: Number(OtOsSi),
            UsuarioId: user.id,
            ContratoId: Number(contratoId),
            ProcessoId: Number(processoId),
            EquipeId: equipeId,
            CoordenadaX: Number(location?.coords.latitude),
            CoordenadaY: Number(location?.coords.longitude)
        }
        setNewAPRContext(objetoDeAPR)
        navigation.navigate("APR")
        return true
    }

    return (
        <>
            <KeyboardAvoidingView behavior={Platform.OS === 'android' ? 'padding' : 'height'} style={styles.container} >
                <ScrollView>
                    <View>
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

                        <Text style={styles.titulo}>Equipe:</Text>
                        <MultiSelect
                            items={colaboradoresFormatados}
                            uniqueKey="id"
                            selectedItems={equipeId}
                            onSelectedItemsChange={(selectedItems: number[]) => setEquipeId(selectedItems)}
                            searchInputPlaceholderText="Pesquisar..."
                            itemTextColor="blue"
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
            <View style={styles.centralizarBotao}>
                <Botao texto='Iniciar' onPress={newAPR} />
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