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
import { Camera, CameraCapturedPicture, PermissionResponse } from 'expo-camera'
import { FontAwesome } from '@expo/vector-icons'
import Buttom from '../components/NextButton'
import NaoConformidadeContext from '../contexts/NaoConformidades';

interface photoProps {
    respostaId: number,
    fotoId: number,
    tipo?: undefined,
    nodeDoArquivo: string,
    hiperlink?: string
}

const NaoConformidades: React.FC = () => {
    const [naoConformidadesRegistradas, setNaoConformidadesRegistradas] = useState<Array<string>>([])
    const { respostaId, setRespostaIdContext } = useContext(NaoConformidadeContext)
    const [cameraPos, setCameraPos] = useState(Camera.Constants.Type.back)
    const [textDescricao, setTextDescricao] = useState<string>()
    const [visible, setVisible] = useState<boolean>(false)
    const [photoURI, setPhotoURI] = useState<string>()
    const [perms, setPerms] = useState<boolean>()
    var camera: Camera

    useEffect(() => {
        (async () => {
            if (perms === undefined) {
                alert('A seguir, virá uma janela onde precisará da permissão do usuário para o acesso a camera, para conceder este acesso, aperte em "Allow" na próxima janela que irá aparecer depois desta.')
            }
            const { status }: PermissionResponse = await Camera.requestPermissionsAsync()
            setPerms(status === 'granted')
        })()
    }, [])

    async function takePic() {
        const data: CameraCapturedPicture = await camera.takePictureAsync()
        // console.log(data)
        setPhotoURI(data.uri)
        setVisible(true)
    }

    function handleSavePic() {
        setRespostaIdContext(Number(respostaId))
        const arrURI: string[] = naoConformidadesRegistradas
        arrURI.push(String(photoURI))
        console.log(arrURI)
        setNaoConformidadesRegistradas(arrURI)
        setVisible(false)
    }

    if (perms) {
        return (
            <SafeAreaView style={style.container}>
                <Text style={{ fontSize: 20, marginVertical: 20 }}>Insira aqui uma foto da Não Conformidade.</Text>
                <Camera
                    type={cameraPos}
                    style={style.camera}
                    ref={(r: Camera) => {
                        camera = r
                    }}
                >
                    <View style={style.buttonContainer}>
                        <TouchableOpacity onPress={() => {
                            setCameraPos(
                                cameraPos === Camera.Constants.Type.back
                                    ? Camera.Constants.Type.front
                                    : Camera.Constants.Type.back
                            )
                        }} activeOpacity={0.3} style={style.virarCamera}>
                            <Text>Virar câmera</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.2} onPress={takePic} style={style.buttonCamContainer}>
                            <FontAwesome name='camera' style={{ fontSize: 30 }} />
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
                                            <FontAwesome name='window-close' size={40} color='#F00' />
                                        </TouchableOpacity>
                                        <Text style={{ textAlign: 'center', fontSize: 20, marginVertical: 10, fontWeight: 'bold' }}>A imagem está nítida e compreensiva?</Text>
                                        <Image
                                            style={{
                                                width: Dimensions.get('window').width * 0.93,
                                                height: Dimensions.get('window').width * 0.92
                                            }}
                                            source={{ uri: photoURI }}
                                        />
                                    </View>
                                    <SafeAreaView style={{ justifyContent: 'center', paddingVertical: 30 }}>
                                        <Text style={{ marginRight: 10 }}>Por favor insira uma descrição para esta foto no campo abaixo.</Text>
                                        <TextInput style={{ borderBottomWidth: 1, borderColor: 'lightblue', textAlign: 'center', fontWeight: 'bold', fontStyle: 'italic' }} onChangeText={(value: string) => setTextDescricao(value)} />
                                    </SafeAreaView>
                                    <View style={{ alignItems: 'center' }}>
                                        <Buttom texto="Sim, pode salvar!" style={style.button} onPress={handleSavePic} />
                                    </View>
                                </KeyboardAvoidingView>
                            </Modal>
                        }
                    </KeyboardAvoidingView>
                </Camera>
                <View style={{flexDirection: 'row'}}>
                    {naoConformidadesRegistradas.map(item => {
                       return <Image source={{uri: item}} style={{width: 100, height: 100, marginHorizontal: 10, marginTop: -60}}/>
                    })}
                </View>
                <Text>E depois confirme se todas as Não Conformidades foram registradas.</Text>
                <Buttom texto="Confirmar"/>
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
        maxHeight: Dimensions.get('window').height * 0.7,
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