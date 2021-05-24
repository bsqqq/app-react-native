import React, { useState, useEffect, useContext } from 'react'
import { 
    Text, 
    View, 
    StyleSheet, 
    TextInput, 
    KeyboardAvoidingView, 
    Platform, 
    Dimensions,
    Button } from 'react-native'
import Botao from '../components/NextButton'
import fb from '../services/firebase'
import { InspecaoContextData } from '../contexts/inspecao'
import { useNavigation } from '@react-navigation/native'
import FilterPicker, { ModalFilterPickerOption } from 'react-native-modal-filter-picker'
import municipios from '../municipios.json'
import * as Location from 'expo-location'
import AuthContext from '../contexts/auth'

export default function NovaInspecao() {
    const navigation = useNavigation()
    const [location, setLocation] = useState<Location.LocationObject>()
    const [municipioId, setMunicipioId] = useState<number>()
    const [numInsepcao, setNumInspecao] = useState<number>()
    const [localidade, setLocalidade] = useState<string>()
    const [municipio, setMunicipio] = useState<string>()
    const [dataHora, setDataHora] = useState<string>() 
    const [errorMsg, setErrorMsg] = useState<string>()
    const [OtOsSi, setOtOsSi] = useState<number>()
    const [visible, setVisible] = useState(false)
    const { user } = useContext(AuthContext)
    const db = fb.database()

    async function handleNewInspecao() {
        try {
            const newInspecao: InspecaoContextData = {
                id: new Date().getTime(),
                NumeroDeInspecao: numInsepcao,
                DataEHoraDaInspecao: dataHora,
                OT_OS_SI: OtOsSi,
                MunicipioId: municipioId,
                Localidade: localidade,
                CoordenadaX: location?.coords.latitude,
                CoordenadaY: location?.coords.longitude,
                Inspetor: user?.name
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
    municipios.forEach(item => {
        municipioFormatado.push({
            key: item.id, 
            label: item.nome
        })
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
                    
                    <View style={{flexDirection: 'row'}}>
                        <Text style={styles.titulo}>Município:</Text>
                        <Text style={{fontStyle: 'italic', marginLeft: 10, fontSize: 20}}>{municipio}</Text>
                    </View>
                    <View style={styles.municipio}>
                        <Button 
                            title="Pressione aqui para escolher o município" 
                            onPress={() => setVisible(true)}
                        />
                    </View>
                    <FilterPicker
                        visible={visible}
                        onSelect={(item: any) => {
                            console.log(item)
                            setMunicipioId(item.key)
                            setMunicipio(item.label)
                            setVisible(false)
                        }}
                        onCancel={() => setVisible(false)}
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
                <Botao texto='Iniciar' onPress={handleNewInspecao}/>
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
    },
    municipio: {
        marginVertical: 10,
        flexDirection: 'row'
    }
})