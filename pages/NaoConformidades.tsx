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
}

const NaoConformidades: React.FC = () => {
    const [cameraPos, setCameraPos] = useState(Camera.Constants.Type.back)
    const { respostaId } = useContext(NaoConformidadeContext)
    const [visible, setVisible] = useState<boolean>(false)
    const [photoURI, setPhotoURI] = useState<string>()
    const [perms, setPerms] = useState<boolean>()
    let camera: Camera

    useEffect(() => {
        (async () => {
            const { status }: PermissionResponse = await Camera.requestPermissionsAsync()
            setPerms(status === 'granted')
        })()
    }, [])

    async function takePic() {
        console.log('entrou aqui')
        if (!camera) { console.log('nao tem camera'); return }
        const data: CameraCapturedPicture = await camera.takePictureAsync()
        console.log(data)
        setPhotoURI(data.uri)
        setVisible(true)
    }

    function handleSavePic(photoURI: string) {

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
                        <TouchableOpacity onPress={takePic} activeOpacity={0.2}>
                            <FontAwesome name='camera' size={32} color='#000' />
                        </TouchableOpacity>

                    </View>

                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'android' ? 'height' : 'padding'}
                        style={style.container}
                        keyboardVerticalOffset={
                            Platform.select({
                                ios: Number(() => 0),
                                android: Number(() => 200)
                            })
                        }>
                        {
                            photoURI &&
                            <Modal
                                animationType='slide'
                                transparent={false}
                                visible={visible}
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
                                <SafeAreaView style={{ flexDirection: 'row', justifyContent: 'center', paddingVertical: 30 }}>
                                    <Text style={{ marginRight: 10 }}>Por favor insira uma descrição para esta foto.</Text>
                                    <TextInput style={{ borderBottomColor: 'lightblue' }} />
                                </SafeAreaView>
                                <View style={{ alignItems: 'center' }}>
                                    <Buttom texto="Sim, pode salvar!" style={style.button} />
                                </View>
                            </Modal>
                        }
                    </KeyboardAvoidingView>
                </Camera>
                <Text>E depois se todas as Não Conformidades foram registradas.</Text>
            </SafeAreaView>
        );
    } else {
        return (
            <SafeAreaView style={style.container}>
                <Text> Precisa habilitar o uso da Camera para registrar as não conformidades! </Text>
            </SafeAreaView>
        )
    }

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
    buttonContainer2: {
        backgroundColor: 'white',
        flexDirection: 'row',
        padding: 10,
        borderRadius: 10,
        marginHorizontal: 10
    },
    buttonContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 20,
        left: 20,
        padding: 10,
        borderRadius: 10,
        marginHorizontal: 10
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
        borderRadius: 10
    }
})

export default NaoConformidades;