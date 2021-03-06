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
import FilterPicker, { ModalFilterPickerOption } from 'react-native-modal-filter-picker'
import * as fs from 'expo-file-system'
import Botao from '../components/NextButton'
import InspecaoContext from '../contexts/inspecao'
import { useNavigation } from '@react-navigation/native'
import * as Location from 'expo-location'
import AuthContext from '../contexts/auth'
import MultiSelect from 'react-native-multiple-select'
import netinfo from '@react-native-community/netinfo';
import fb from '../services/firebase'

interface ProcessosContratosProps {
    [index: string]: {
        id: number | string,
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

export interface objetoDeInspecao {
    id: number | undefined,
    NumeroDeInspecao: number | undefined,
    DataEHoraDaInspecao: string | undefined,
    OT_OS_SI: number | undefined,
    MunicipioId: number | undefined,
    Localidade?: string | undefined,
    CoordenadaX: number | undefined
    CoordenadaY: number | undefined,
    Inspetor: string | undefined,
    InspetorId: number | undefined,
    Placa: string | undefined,
    EquipeId: number[] | undefined,
    ContratoId: number | undefined,
    ProcessoId: number | undefined,
}

export default function NovaInspecao() {
    var path = fs.documentDirectory + 'json/'
    const fileUri = (jsonId: string) => path + `${jsonId}.json`
    const { setProcessoContratoIdContextData, setInspecaoIdContextData, setNewInspecao, setEquipeIdContext } = useContext(InspecaoContext)
    const [colaboradoresFormatados, setColaboradoresFormatados] = useState<MultiProps[]>([])
    const [processosState, setProcessosState] = useState<ProcessosContratosProps>({})
    const [contratosState, setContratosState] = useState<ProcessosContratosProps>({})
    const [location, setLocation] = useState<Location.LocationObject>()
    const [municipiosState, setMunicipiosState] = useState<any[]>()
    const [municipioVisible, setMunicipioVisible] = useState(false)
    const [contratoVisible, setContratoVisible] = useState(false)
    const [processoVisible, setProcessoVisible] = useState(false)
    const [municipioId, setMunicipioId] = useState<number>()
    const [contratoId, setContratoId] = useState<number>(0)
    const [processoId, setProcessoId] = useState<number>(0)
    const [equipeId, setEquipeId] = useState<number[]>([])
    const [municipio, setMunicipio] = useState<string>()
    const [processo, setProcesso] = useState<string>()
    const [contrato, setContrato] = useState<string>()
    const [dataHora, setDataHora] = useState<string>()
    const [OtOsSi, setOtOsSi] = useState<number>()
    const [placa, setPlaca] = useState<string>()
    const { user } = useContext(AuthContext)
    const navigation = useNavigation()
    const db = fb.database()
    var processos: ProcessosContratosProps
    var colaboradores: ColaboradoresProps
    var contratos: ContratoProps = {}
    var municipios: any[]

    async function handleNewInspecao() {
        try {
            var controle = JSON.parse(await fs.readAsStringAsync(fileUri('numero-de-inspecao')))
            var estouOnline = Boolean((await netinfo.fetch()).isConnected)
            var snap = estouOnline ? await db.ref('/controle/numero-de-inspecao').once('value') : undefined
            var shot = snap ? snap.exportVal() : undefined
            const newInspecao: objetoDeInspecao = {
                id: new Date().getTime(),
                NumeroDeInspecao: estouOnline ? shot : controle,
                DataEHoraDaInspecao: dataHora,
                OT_OS_SI: OtOsSi,
                MunicipioId: municipioId,
                CoordenadaX: location?.coords.latitude,
                CoordenadaY: location?.coords.longitude,
                Inspetor: user?.name,
                InspetorId: user?.id,
                EquipeId: equipeId,
                Placa: placa,
                ContratoId: contratoId,
                ProcessoId: processoId
            }
            // garantir que todos os campos sejam preenchidos
            const keys = Object.keys(newInspecao)
            let flag = keys.find(item => {
                // retorna o primeiro item da newInspecao que estiver vazio
                return !newInspecao[item]
            })
            if (!flag) {
                setProcessoContratoIdContextData(Number(processoId), Number(contratoId))
                setInspecaoIdContextData(Number(newInspecao.id))
                setNewInspecao(JSON.stringify(newInspecao))
                setEquipeIdContext(newInspecao?.EquipeId)
                navigation.navigate('TelaDePerguntas', { key: "inspecao" })
                return
            } else {
                alert(`Algum campo possivelmente est?? vazio, voc?? esqueceu de preencher algum campo?`)
                console.log('Erro: Algum campo possivelmente est?? vazio, voc?? esqueceu de preencher algum campo?')
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        let colaboradoresFormatadosPreState: MultiProps[] = []
        const date = new Date()
        setDataHora(`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${new Date().toLocaleTimeString()}`);

        (async (): Promise<void> => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                return;
            }
            let location = await Location.getCurrentPositionAsync({ accuracy: 1 });
            setLocation(location);
        })();

        (async (): Promise<void> => {
            colaboradores = JSON.parse(await fs.readAsStringAsync(fileUri('colaboradores')))
            const keys: string[] = Object.keys(colaboradores)
            keys.forEach(item => {
                colaboradoresFormatadosPreState.push({
                    id: String(colaboradores[item].id),
                    name: colaboradores[item].nome
                })
            })
            setColaboradoresFormatados(colaboradoresFormatadosPreState)
            municipios = JSON.parse(await fs.readAsStringAsync(fileUri('municipios')))
            processos = JSON.parse(await fs.readAsStringAsync(fileUri('processos')))
            contratos = JSON.parse(await fs.readAsStringAsync(fileUri('contratos')))
            setMunicipiosState(municipios)
            setProcessosState(processos)
            setContratosState(contratos)
        })()
    }, [])

    let municipioFormatado: ModalFilterPickerOption[] = []
    municipiosState?.forEach(municipio => {
        municipioFormatado.push({
            key: String(municipio.id),
            label: municipio.nome
        })
    })

    const processosTipados: ProcessosContratosProps = processosState
    let processosFormatados: ModalFilterPickerOption[] = []
    const chaves: string[] = Object.keys(processosTipados)
    chaves.forEach(item => {
        processosFormatados.push({
            key: String(processosTipados[item].id),
            label: processosTipados[item].nome
        })
    })

    const contratosTipados: ProcessosContratosProps = contratosState
    let contratosFormatados: ModalFilterPickerOption[] = []
    const keys: string[] = Object.keys(contratosTipados)
    keys?.forEach(item => {
        contratosFormatados.push({
            key: String(contratosTipados[item].id),
            label: contratosTipados[item].nome
        })
    })

    return (
        <>
            <KeyboardAvoidingView behavior={Platform.OS === 'android' ? 'padding' : 'height'} style={styles.container} >
                <ScrollView>
                    <View>
                        <Text style={styles.titulo}>Data e hora da inspe????o:</Text>
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
                            <Text style={styles.titulo}>Munic??pio:</Text>
                            <Text style={{ fontStyle: 'italic', marginLeft: 10, fontSize: 20 }}>{municipio}</Text>
                        </View>
                        <View style={styles.municipioBotao}>
                            <Button
                                title="Pressione aqui para escolher o munic??pio"
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

                        {/* <Text style={styles.titulo}>Bairro / Localidade:</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType='default'
                            onChangeText={value => setLocalidade(value)}
                        /> */}

                        <Text style={styles.titulo}>Placa do carro:</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType='default'
                            onChangeText={value => setPlaca(value)}
                            maxLength={7}
                        />

                        <Text style={styles.titulo}>Equipe:</Text>
                        <MultiSelect
                            items={colaboradoresFormatados}
                            uniqueKey="id"
                            selectedItems={equipeId}
                            onSelectedItemsChange={(selectedItems: number[]) => setEquipeId(selectedItems)}
                            searchInputPlaceholderText="Buscar colaboradores..."
                            itemTextColor="blue"
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
        paddingHorizontal: 30,
        marginTop: 100,
        maxHeight: Dimensions.get('screen').height * 0.55,
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
        fontStyle: 'italic',
        paddingLeft: 10
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