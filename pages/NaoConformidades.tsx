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
    Platform
} from 'react-native';
import {
    Camera,
    CameraCapturedPicture,
    PermissionResponse,
} from 'expo-camera'
import { FontAwesome } from '@expo/vector-icons'
import Buttom from '../components/NextButton'
import NaoConformidadeContext from '../contexts/NaoConformidades';
import { useNavigation } from '@react-navigation/native'

interface photoProps {
    respostaId: number | undefined,
    fotoId: number,
    tipo?: undefined,
    nodeDoArquivo: string,
    hiperlink?: string
}

const NaoConformidades: React.FC = () => {
    const [naoConformidadesRegistradas, setNaoConformidadesRegistradas] = useState<Array<string>>([])
    const { respostaId } = useContext(NaoConformidadeContext)
    const [cameraPos, setCameraPos] = useState(Camera.Constants.Type.back)
    const [textDescricao, setTextDescricao] = useState<string>()
    const [visible, setVisible] = useState<boolean>(false)
    const [nomeFoto, setNomeFoto] = useState<string>('')
    const [photoURI, setPhotoURI] = useState<string>()
    const [perms, setPerms] = useState<boolean>()
    const navigation = useNavigation()
    var camera: Camera

    useEffect(() => {
        (async () => {
            const { status }: PermissionResponse = await Camera.requestPermissionsAsync()
            setPerms(status === 'granted')
        })()
    }, [])

    async function takePic() {
        const data: CameraCapturedPicture = await camera.takePictureAsync({})
        setPhotoURI(data.uri)
        setVisible(true)
    }

    function handleSavePic() {
        if (textDescricao == '' || textDescricao == undefined) {
            alert('O campo de descrição está vazío! Por favor preencha o campo de descrição.')
            return
        }
        const arrURI: string[] = naoConformidadesRegistradas
        arrURI.push(String(photoURI))
        console.log(arrURI)
        setNaoConformidadesRegistradas(arrURI)
        setVisible(false)
    }

    function handleConfirmInspection() {
        const objDeNaoConformidade: photoProps = {
            fotoId: new Date().getTime(),
            nodeDoArquivo: nomeFoto,
            respostaId,
        }
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
                                visible={visible}
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
                                    <View style={{ margin: 20 }}>
                                        <TouchableOpacity style={{ margin: 10 }} onPress={() => setVisible(false)}>
                                            <FontAwesome
                                                name='window-close'
                                                size={40}
                                                color='#F00'
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
                                                width: Dimensions.get('window').width * 0.9,
                                                height: Dimensions.get('window').width * 0.9
                                            }}
                                            source={{ uri: photoURI }}
                                        />
                                    </View>

                                    <SafeAreaView
                                        style={{
                                            justifyContent: 'space-between',
                                            marginVertical: 20,
                                            flexDirection: 'row',
                                            alignItems: 'flex-end'
                                        }}>
                                        <View>
                                            <Text
                                                style={{
                                                    marginHorizontal: 10,
                                                    maxWidth: 250,
                                                    textAlign: 'center'
                                                }}>
                                                Por favor insira UMA DESCRIÇÃO para esta foto no campo abaixo. (Obrigatório)
                                            </Text>
                                            <TextInput
                                                style={{
                                                    borderBottomWidth: 1,
                                                    borderColor: 'lightblue',
                                                    textAlign: 'center',
                                                    fontWeight: 'bold',
                                                    fontStyle: 'italic',
                                                    maxWidth: 250
                                                }}
                                                onChangeText={
                                                    (value: string) => setTextDescricao(value)
                                                }
                                            />
                                        </View>

                                        <View>
                                            <Text
                                                style={{
                                                    marginHorizontal: 10,
                                                    maxWidth: 250,
                                                    textAlign: 'center'
                                                }}>
                                                Isso está atrelado a um colaborador?
                                                se sim, insira o nome do colaborador abaixo
                                            </Text>
                                            <TextInput
                                                style={{
                                                    borderBottomWidth: 1,
                                                    borderColor: 'lightblue',
                                                    textAlign: 'center',
                                                    fontWeight: 'bold',
                                                    fontStyle: 'italic'
                                                }}
                                                onChangeText={(value: string) => setNomeFoto(value)} />
                                        </View>

                                    </SafeAreaView>
                                    <View style={{ alignItems: 'center' }}>
                                        <Buttom texto="Sim, pode salvar!" style={style.button} onPress={handleSavePic} />
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
                    {naoConformidadesRegistradas.map(item => {
                        return <Image
                            source={{ uri: item }}
                            style={{
                                width: 100,
                                height: 100,
                                marginHorizontal: 10,
                                marginTop: -80
                            }}
                        />
                    })}
                </View>
                <Text>E depois confirme se todas as Não Conformidades foram registradas.</Text>
                <Buttom
                    texto="Confirmar"
                    onPress={handleConfirmInspection}
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
        marginBottom: 90
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