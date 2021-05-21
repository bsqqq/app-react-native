import React, { useState, useEffect } from 'react'
import { 
    Text, 
    View, 
    StyleSheet, 
    TextInput, 
    KeyboardAvoidingView, 
    Platform, 
    Dimensions } from 'react-native'
import Button from '../components/NextButton'
import fb from '../services/firebase'
import { InspecaoContext } from '../contexts/inspecao'
import { useNavigation } from '@react-navigation/native'
import FilterPicker, { ModalFilterPickerOption } from 'react-native-modal-filter-picker'
import { searchMunicipiosById } from '../services/apiIBGE'
import municipios from '../municipios.json'

export default function NovaInspecao() {
    const navigation = useNavigation()
    const [municipioId, setMunicipioId] = useState<number>()
    const [numInsepcao, setNumInspecao] = useState<number>()
    const [localidade, setLocalidade] = useState<string>()
    const [municipio, setMunicipio] = useState<string>()
    const [dataHora, setDataHora] = useState<string>() 
    const [visible, setVisible] = useState(false)
    const [OtOsSi, setOtOsSi] = useState<number>()
    const db = fb.database()

    async function handleNewInspecao() {
        try {
            const newInspecao: InspecaoContext = {
                id: new Date().getTime(),
                NumeroDeInspecao: numInsepcao,
                DataEHoraDaInspecao: dataHora,
                OT_OS_SI: OtOsSi,
                MunicipioId: municipioId,
                Localidade: localidade
            }
            console.log(newInspecao)
            await db.ref(`/inspecoes/${newInspecao.id}`).set(newInspecao)
            navigation.navigate('TelaDePerguntas')            
        } catch (error) {
            console.log(error)
        }
}

    useEffect(() => {
        const date = new Date()
        setDataHora(`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${new Date().toLocaleTimeString()}`)
    }, [])
    
    let municipioFormatado: ModalFilterPickerOption[] = []
    municipios.forEach(item => {
        municipioFormatado.push({key: String(item.id), label: item.nome})
    })
    return (
        <>
            <KeyboardAvoidingView behavior={Platform.OS === 'android' ? 'padding' : 'height'} style={styles.container} >
                <View>
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

                    <Text style={styles.titulo}>Município:</Text>
                    <TextInput 
                        style={styles.input} 
                        keyboardType='default'
                        value={municipio}
                        onChangeText={value => setMunicipio(value)}
                    />
                    <FilterPicker
                        visible={visible}
                        onSelect={(picked) => {
                            setMunicipioId(picked.key); 
                            setVisible(false)
                            // console.log(picked)
                        }}
                        onCancel={() => {
                            setMunicipioId(undefined)
                            setVisible(false)
                        }}
                        options={municipioFormatado}
                    />
                    
                    <Text style={styles.titulo}>Bairro / Localidade:</Text>
                    <TextInput 
                        style={styles.input} 
                        keyboardType='default'
                        onChangeText={value => setLocalidade(value)}
                    />
                </View>
            </KeyboardAvoidingView>
            
                <View style={styles.centralizarBotao}>
                    <Button texto='Iniciar' onPress={handleNewInspecao}/>
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
    },
    titulo: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5
    },
    input:{
        backgroundColor: 'lightgrey',
        padding: 10,
        width: Dimensions.get('window').width - 60,
        marginBottom: 20,
        fontStyle: 'italic'
    },
    centralizarBotao: {
        alignItems: 'center',
        bottom: 130
    }
})