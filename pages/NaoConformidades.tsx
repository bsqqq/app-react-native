import React, { useEffect, useState, useContext } from 'react';
import {
    View,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    Modal,
    Image,
    Dimensions,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Button,
} from 'react-native';
import {
    Camera,
    CameraCapturedPicture,
    PermissionResponse,
} from 'expo-camera'
import FilterPicker, { ModalFilterPickerOption } from 'react-native-modal-filter-picker'
import { FontAwesome } from '@expo/vector-icons'
import Buttom from '../components/NextButton'
import { useNavigation } from '@react-navigation/native'
import * as MediaLibrary from 'expo-media-library';
import InspecaoContext from '../contexts/inspecao';
import * as fs from 'expo-file-system'
import DateTimePicker from '@react-native-community/datetimepicker'

const NaoConformidades: React.FC = () => {
    const { setFotosInspecao, setDescricaoContext, setColabIdContext, setDates } = useContext(InspecaoContext)
    const [naoConformidadesRegistradas, setNaoConformidadesRegistradas] = useState<Array<string>>([])
    const [colaboradores, setColaboradores] = useState<ModalFilterPickerOption[]>([])
    const [colaboradoresVisible, setColaboradoresVisible] = useState<boolean>(false)
    const [cameraPos, setCameraPos] = useState(Camera.Constants.Type.back)
    const [modalVisible, setModalVisible] = useState<boolean>(false)
    const [textDescricao, setTextDescricao] = useState<string>()
    const colabsFormatados: ModalFilterPickerOption[] = []
    const [photoURI, setPhotoURI] = useState<string>()
    const [colabId, setColabId] = useState<number>()
    const [colab, setColab] = useState<string>('')
    const [perms, setPerms] = useState<boolean>()
    const [date, setDate] = useState<Date>();
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const navigation = useNavigation()
    var camera: Camera

    useEffect(() => {
        (async () => {
            const { status }: PermissionResponse = await Camera.requestPermissionsAsync()
            setPerms(status === 'granted')
        })();

        (async () => {
            const { status }: PermissionResponse = await MediaLibrary.requestPermissionsAsync()
            setPerms(status === 'granted')
        })();

        (async () => {
            var path = fs.documentDirectory + 'json/'
            const fileUri = (jsonId: string) => path + `${jsonId}.json`
            var colabs = JSON.parse(await fs.readAsStringAsync(fileUri('colaboradores')))
            let keys = Object.keys(colabs)
            keys.forEach(key => {
                colabsFormatados.push({
                    key: String(colabs[key].id),
                    label: colabs[key].nome
                })
            })
            setColaboradores(colabsFormatados)
        })()
    }, [])

    const onChange = (event: any, selectedDate: Date | undefined) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const showMode = (currentMode: string) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    async function takePic() {
        const data: CameraCapturedPicture = await camera.takePictureAsync({ quality: 0.4 })
        setPhotoURI(data.uri)
        setModalVisible(true)
    }

    function handleModalSavePic() {
        if (textDescricao == '' || textDescricao == undefined) {
            alert('O campo de descrição está vazío! Por favor preencha o campo de descrição.')
            return
        }
        const arrURI: string[] = naoConformidadesRegistradas
        arrURI.push(String(photoURI))
        setNaoConformidadesRegistradas(arrURI)
        setDescricaoContext(textDescricao)
        setColabIdContext(Number(colabId ? colabId : 0))
        setColab('')
        setColabId(0)
        setDates(`${date?.getDate()}/${date?.getMonth() + 1}`)
        setModalVisible(false)
    }

    async function handleConfirmNaoConformidade() {
        for (var i = 0; i < naoConformidadesRegistradas.length; i++) {
            await MediaLibrary.createAssetAsync(naoConformidadesRegistradas[i])
            setFotosInspecao(naoConformidadesRegistradas[i])
        }
        console.log(`antes de mandar as fotos para o context = ${naoConformidadesRegistradas}`)
        navigation.navigate('TelaDePerguntas')
    }

    if (perms) {
        return (
            <SafeAreaView style={style.container}>
                <Text
                    style={{
                        fontSize: 20,
                        marginVertical: 20
                    }}>
                    Insira aqui uma foto da Não Conformidade.
                </Text>
                <Camera
                    type={cameraPos}
                    style={style.camera}
                    ref={(r: Camera) => {
                        camera = r
                    }}
                >
                    <View style={style.buttonContainer}>
                        <TouchableOpacity
                            onPress={() => {
                                setCameraPos(
                                    cameraPos === Camera.Constants.Type.back
                                        ? Camera.Constants.Type.front
                                        : Camera.Constants.Type.back
                                )
                            }}
                            activeOpacity={0.3}
                            style={style.virarCamera}>
                            <Text>Virar câmera</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.2}
                            onPress={takePic}
                            style={style.buttonCamContainer}
                        >
                            <FontAwesome
                                name='camera'
                                style={{ fontSize: 30 }}
                            />
                        </TouchableOpacity>
                    </View>
                    <KeyboardAvoidingView>
                        {
                            photoURI &&
                            <Modal
                                animationType='slide'
                                transparent={false}
                                visible={modalVisible}
                            >
                                <KeyboardAvoidingView
                                    behavior={Platform.OS === 'android' ? 'padding' : 'height'}
                                    style={style.container}
                                    keyboardVerticalOffset={
                                        Platform.select({
                                            ios: 200,
                                            android: 20
                                        })
                                    }
                                >
                                    <View style={{ marginTop: 20 }}>
                                        <TouchableOpacity style={{ marginTop: 10 }} onPress={() => setModalVisible(false)}>
                                            <FontAwesome
                                                name='window-close'
                                                size={40}
                                                color='#cf1818'
                                            />
                                        </TouchableOpacity>
                                        <Text
                                            style={{
                                                textAlign: 'center',
                                                fontSize: 20,
                                                marginVertical: 10,
                                                fontWeight: 'bold'
                                            }}>A imagem está nítida e compreensiva?
                                        </Text>
                                        <Image
                                            style={{
                                                width: Dimensions.get('window').width * 0.7,
                                                height: Dimensions.get('window').width * 0.7,
                                                borderRadius: 10,
                                                alignSelf: 'center'
                                            }}
                                            source={{ uri: photoURI }}
                                        />
                                    </View>
                                    <SafeAreaView
                                        style={{
                                            marginVertical: 20
                                        }}>
                                        <View style={{ justifyContent: 'space-between' }}>
                                            <View style={{ alignItems: 'center' }}>
                                                <Text
                                                    style={{
                                                        marginHorizontal: 10,
                                                        maxWidth: 170,
                                                        textAlign: 'center'
                                                    }}>
                                                    Descrição (Obrigatório)
                                                </Text>
                                                <TextInput
                                                    style={{
                                                        borderBottomWidth: 1,
                                                        borderColor: 'lightblue',
                                                        textAlign: 'center',
                                                        fontWeight: 'bold',
                                                        fontStyle: 'italic',
                                                        marginBottom: 10,
                                                        width: 300,
                                                        alignItems: 'center'
                                                    }}
                                                    onChangeText={
                                                        (value: string) => setTextDescricao(value)
                                                    }
                                                />
                                                <Text>{colab}</Text>
                                                <FilterPicker
                                                    visible={colaboradoresVisible}
                                                    onSelect={(item: any) => {
                                                        console.log(item)
                                                        setColabId(Number(item.key))
                                                        setColab(item.label)
                                                        setColaboradoresVisible(false)
                                                    }}
                                                    onCancel={() => setColaboradoresVisible(false)}
                                                    options={colaboradores}
                                                />
                                                <Button title="selecionar o colaborador" onPress={() => setColaboradoresVisible(true)} />
                                                <Text>{`Data estabelecida: ${date?.getDate() || ''}/${date?.getMonth() + 1 || ''}` || ''}</Text>
                                                <Button title="Inserir prazo" onPress={showDatepicker} />
                                                {show && (
                                                    <DateTimePicker
                                                        testID="dateTimePicker"
                                                        value={date || new Date()}
                                                        is24Hour={true}
                                                        display="default"
                                                        onChange={onChange}
                                                    />
                                                )}
                                            </View>
                                        </View>
                                    </SafeAreaView>
                                    <View style={{ alignItems: 'center' }}>
                                        <Buttom texto="Salvar!" style={style.button} onPress={handleModalSavePic} />
                                    </View>
                                </KeyboardAvoidingView>
                            </Modal>
                        }
                    </KeyboardAvoidingView>
                </Camera>
                <View
                    style={{
                        flexDirection: 'row'
                    }}>
                    {naoConformidadesRegistradas.map((item, key) => {
                        return (
                            <>
                                <Image
                                    source={{ uri: item }}
                                    style={{
                                        width: 100,
                                        height: 100,
                                        marginHorizontal: 10,
                                        marginTop: -80
                                    }}
                                    key={key}
                                />
                                {/* <FontAwesome
                                    name='window-close'
                                    size={25}
                                    color='#cf1818'
                                    onPress={() => setNaoConformidadesRegistradas(naoConformidadesRegistradas.splice(naoConformidadesRegistradas.indexOf(naoConformidadesRegistradas[key]), 1))}
                                    key={key + 1}
                                    style={{position: 'absolute'}}
                                /> */}
                            </>
                        )
                    })}
                </View>
                <Text>E depois confirme se todas as Não Conformidades foram registradas.</Text>
                <Buttom
                    texto="Confirmar"
                    onPress={handleConfirmNaoConformidade}
                />
            </SafeAreaView>
        );
    } else
        return (
            <SafeAreaView style={style.container}>
                <Text> Precisa habilitar o uso da Camera para registrar as não conformidades! </Text>
            </SafeAreaView>
        )
}

const style = StyleSheet.create({
    camera: {
        flex: 1,
        width: Dimensions.get('window').width * 0.8,
        maxHeight: Dimensions.get('window').height * 0.72,
        marginBottom: 90,
        borderRadius: 5
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonContainer: {
        flexDirection: 'row',
        width: Dimensions.get('window').width * 0.8,
        height: Dimensions.get('window').height * 0.7,
        position: 'absolute',
        bottom: 5
    },
    buttonCamContainer: {
        backgroundColor: 'white',
        position: 'absolute',
        bottom: 20,
        right: 20,
        padding: 15,
        borderRadius: 15
    },
    button: {
        backgroundColor: 'lightblue',
        justifyContent: 'center',
        borderRadius: 16,
        marginBottom: 30,
        minHeight: 56,
        minWidth: 56,
        maxWidth: 300,
    },
    virarCamera: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        position: 'absolute',
        bottom: 20,
        marginLeft: 10
    }
})

export default NaoConformidades;