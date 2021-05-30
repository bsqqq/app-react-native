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
    ScrollView } from 'react-native'
import Botao from '../components/NextButton'
import fb from '../services/firebase'
import { InspecaoContextData } from '../contexts/inspecao'
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

export default function NovaInspecao() {
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
    const [errorMsg, setErrorMsg] = useState<string>()
    const [OtOsSi, setOtOsSi] = useState<number>()
    const [equipe, setEquipe] = useState<string>()
    const [placa, setPlaca] = useState<string>()
    const { user } = useContext(AuthContext)
    const navigation = useNavigation()
    const db = fb.database()

    async function handleNewInspecao() {
        try {
            const newInspecao: InspecaoContextData = {
                id: new Date().getTime(),
                CoordenadaY: location?.coords.longitude,
                CoordenadaX: location?.coords.latitude,
                DataEHoraDaInspecao: dataHora,
                NumeroDeInspecao: numInspecao,
                MunicipioId: municipioId,
                Localidade: localidade,
                ProcessoId: processoId,
                ContratoId: contratoId,
                Inspetor: user?.name,
                OT_OS_SI: OtOsSi,
                Equipe: equipe,
                Placa: placa
            }
            if(
                (!newInspecao.NumeroDeInspecao?.toString().trim() || newInspecao.NumeroDeInspecao?.toString() == "")
                && (!newInspecao.MunicipioId?.toString().trim() || newInspecao.MunicipioId?.toString() == "")
                && (!newInspecao.ContratoId?.toString().trim() || newInspecao.ContratoId?.toString() == "")
                && (!newInspecao.ProcessoId?.toString().trim() || newInspecao.ProcessoId?.toString() == "")
                && (!newInspecao.OT_OS_SI?.toString().trim() || newInspecao.OT_OS_SI?.toString() == "")
                && (!newInspecao.Localidade?.trim() || newInspecao.Localidade?.toString() == "")
                && (!newInspecao.Equipe?.trim() || newInspecao.Equipe?.toString() == "")
                && (!newInspecao.Placa?.trim() || newInspecao.Placa?.toString() == "")
                ) {
                    alert('Algum campo possivelmente está vazio, você esqueceu de preencher algum campo?')
                    console.log('Erro: Algum campo possivelmente está vazio, você esqueceu de preencher algum campo?')
                } else {
                    console.log(newInspecao)
                    await db.ref(`/inspecoes/${newInspecao.id}`).set(newInspecao)
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
              setErrorMsg('Permission to access location was denied');
              return;
            }
            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
            Location.Accuracy.Highest
          })()
    },[])
    
    let municipioFormatado: ModalFilterPickerOption[] = []
    municipios.forEach(municipio => {
        municipioFormatado.push({
            key: municipio.id, 
            label: municipio.nome
        })
    })

    const processosTipados: ProcessosProps = processos
    let processosFormatados: ModalFilterPickerOption[] = []
    const chaves: string[] = Object.keys(processosTipados)
    chaves.forEach(item => {
        processosFormatados.push({
            key: processosTipados[item].id,
            label:processosTipados[item].nome
        })
    })

    let contratosFormatados: ModalFilterPickerOption[] = []
    contratos.forEach(contrato => {
        contratosFormatados.push({
            key: contrato.id,
            label: contrato.nome
        })
    })

    return (
        <>
            <KeyboardAvoidingView behavior={ Platform.OS === 'android' ? 'padding' : 'height' } style={ styles.container } >
                <ScrollView>
                    <View>
                        <Text style={styles.titulo}>Número da inspeção:</Text>
                        <TextInput 
                            style={styles.input} 
                            keyboardType='numeric' 
                            onChangeText={ value => setNumInspecao(parseInt(value)) }
                        />

                        <Text style={styles.titulo}>Data e hora da inspeção:</Text>
                        <TextInput 
                            style={styles.input} 
                            value={dataHora} 
                            editable={false}
                            onChangeText={ value => setDataHora(value) }
                        />

                        <Text style={styles.titulo}>OT / OS / SI:</Text>
                        <TextInput 
                            style={styles.input} 
                            keyboardType='numeric'
                            onChangeText={ value => setOtOsSi(parseInt(value)) }
                        />
                        
                        <View style={{flexDirection: 'row'}}>
                            <Text style={styles.titulo}>Município:</Text>
                            <Text style={{fontStyle: 'italic', marginLeft: 10, fontSize: 20}}>{municipio}</Text>
                        </View>
                        <View style={styles.municipioBotao}>
                            <Button 
                                title="Pressione aqui para escolher o município" 
                                onPress={ () => setMunicipioVisible(true) }
                            />
                        </View>
                        <FilterPicker
                            visible={municipioVisible}
                            onSelect={(item: any) => {
                                console.log(item)
                                setMunicipioId(item.key)
                                setMunicipio(item.label)
                                setMunicipioVisible(false)
                            }}
                            onCancel={() => setMunicipioVisible(false)}
                            options={ municipioFormatado }
                        />
                        
                        <Text style={styles.titulo}>Bairro / Localidade:</Text>
                        <TextInput 
                            style={styles.input} 
                            keyboardType='default'
                            onChangeText={ value => setLocalidade(value) }
                        />

                        <Text style={styles.titulo}>Placa do carro:</Text>
                        <TextInput 
                            style={styles.input} 
                            keyboardType='default'
                            onChangeText={ value => setPlaca(value) }
                        />

                        <Text style={styles.titulo}>Equipe:</Text>
                        <TextInput 
                            style={styles.input} 
                            keyboardType='default'
                            onChangeText={ value => setEquipe(value) }
                        />

                        <View style={{flexDirection: 'row'}}>
                            <Text style={styles.titulo}>Processo:</Text>
                            <Text style={{fontStyle: 'italic', marginLeft: 10, fontSize: 20}}>{processo}</Text>
                        </View>
                        <View style={styles.municipioBotao}>
                            <Button 
                                title="Pressione aqui para escolher o processo" 
                                onPress={ () => setProcessoVisible(true) }
                            />
                        </View>
                        <FilterPicker
                            visible={processoVisible}
                            onSelect={(item: any) => {
                                console.log(item)
                                setProcessoId(item.key)
                                setProcesso(item.label)
                                setProcessoVisible(false)
                            }}
                            onCancel={() => setProcessoVisible(false)}
                            options={ processosFormatados }
                        />

                        <View style={{flexDirection: 'row'}}>
                            <Text style={styles.titulo}>Contrato:</Text>
                            <Text style={{fontStyle: 'italic', marginLeft: 10, fontSize: 20}}>{contrato}</Text>
                        </View>
                        <View style={styles.municipioBotao}>
                            <Button 
                                title="Pressione aqui para escolher o contrato" 
                                onPress={ () => setContratoVisible(true) }
                            />
                        </View>
                        <FilterPicker
                            visible={contratoVisible}
                            onSelect={(item: any) => {
                                console.log(item)
                                setContratoId(item.key)
                                setContrato(item.label)
                                setContratoVisible(false)
                            }}
                            onCancel={() => setContratoVisible(false)}
                            options={ contratosFormatados }
                        />
                    </View>
                </ScrollView>
            
            <View style={ styles.centralizarBotao }>
                <Botao texto='Iniciar' onPress={ handleNewInspecao }/>
            </View>
            </KeyboardAvoidingView>
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
        maxHeight: 500
    },
    titulo: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5
    },
    input:{
        backgroundColor: 'lightgrey',
        paddingVertical: 3,
        width: Dimensions.get('window').width - 60,
        marginBottom: 20,
        fontStyle: 'italic'
    },
    centralizarBotao: {
        alignItems: 'center',
        bottom: -30,
        left: 95
    },
    municipioBotao: {
        marginVertical: 7,
        flexDirection: 'row'
    }
})