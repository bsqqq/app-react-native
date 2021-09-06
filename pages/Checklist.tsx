import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    TextInput,
    Button
} from 'react-native'
import MultiSelect from 'expo-multiple-select'
import FilterPicker, { ModalFilterPickerOption } from 'react-native-modal-filter-picker'
import * as fs from 'expo-file-system'
import Botao from '../components/NextButton'
import { useNavigation } from '@react-navigation/native'

interface MultiProps {
    id: string,
    name: string
}

interface ProcessosContratosProps {
    [index: string]: {
        id: number | string,
        nome: string,
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

export default function Checklist() {
    var path = fs.documentDirectory + 'json/'
    const fileUri = (jsonId: string) => path + `${jsonId}.json`
    const [colaboradoresFormatados, setColaboradoresFormatados] = useState<MultiProps[]>([])
    const [processoVisible, setProcessoVisible] = useState<boolean>(false)
    const [contratoVisible, setContratoVisible] = useState<boolean>(false)
    const [processoId, setProcessoId] = useState<number>()
    const [contratoId, setContratoId] = useState<number>()
    const [equipeId, setEquipeId] = useState<number[]>()
    const [dataHora, setDataHora] = useState<string>()
    const [processo, setProcesso] = useState<string>()
    const [contrato, setContrato] = useState<string>()
    const [processosState, setProcessosState] = useState<ProcessosContratosProps>({})
    const [contratosState, setContratosState] = useState<ProcessosContratosProps>({})
    var colaboradores: ColaboradoresProps
    var contratos: ProcessosContratosProps = {}
    var processos: ProcessosContratosProps
    const navigation = useNavigation()
    let colaboradoresFormatadosPreState: MultiProps[] = []

    const arrayTeste: MultiProps[] = [{ id: '1', name: 'a' }, { id: '2', name: 'b' }, { id: '3', name: 'c' }]
    useEffect(() => {
        const date = new Date()
        setDataHora(`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${new Date().toLocaleTimeString()}`);

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
            processos = JSON.parse(await fs.readAsStringAsync(fileUri('processos')))
            setProcessosState(processos)
            contratos = JSON.parse(await fs.readAsStringAsync(fileUri('contratos')))
            setContratosState(contratos)
        })();
    }, [])

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

    function handleNewChecklist() {
        navigation.navigate('TelaDePerguntas', { key: 0 })
    }

    return (
        <>
            <KeyboardAvoidingView behavior={Platform.OS === 'android' ? 'padding' : 'height'} style={styles.container} >
                <ScrollView>
                    <View style={styles.container}>
                        <Text style={styles.titulo}>Data e hora do check-list:</Text>
                        <TextInput
                            style={styles.input}
                            value={dataHora}
                            editable={false}
                            onChangeText={value => setDataHora(value)}
                        />

                        <Text style={styles.titulo}>Equipe:</Text>
                        <MultiSelect
                            items={arrayTeste}
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
                <Botao texto='Iniciar' onPress={handleNewChecklist} />
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
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