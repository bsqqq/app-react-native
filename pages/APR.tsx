import React, { useState, useContext, useEffect } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import { Audio, AVPlaybackStatus } from "expo-av";
import * as FileSystem from "expo-file-system";
import * as Font from "expo-font";
import * as Icons from "../components/Icons";
import fb from '../services/firebase'
import { useNavigation } from '@react-navigation/native';
import APRContext from "../contexts/apr";
import Botao from '../components/NextButton'
import { APRProps } from "./preAPR";
import netinfo from '@react-native-community/netinfo';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get("window");
const BACKGROUND_COLOR = "white";
const LIVE_COLOR = "#FF0000";
const DISABLED_OPACITY = 0.3;

export default function PlayerRecorder() {
  const recordingSettings: Audio.RecordingOptions = Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY;
  const [haveRecordingPermissions, setHaveRecordingPermissions] = useState<boolean>(false)
  const [isPlaybackAllowed, setIsPlaybackAllowed] = useState<boolean>(false)
  const [recording, setRecording] = useState<Audio.Recording | null>(null)
  const [recordingDuration, setRecordingDuration] = useState<number>(0)
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const [sound, setSound] = useState<Audio.Sound | null>(null)
  const [fontLoaded, setFontLoaded] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [muted, setMuted] = useState<boolean>(false)
  const { apr } = useContext(APRContext)
  const navigation = useNavigation()

  // quando o componente for carregado...
  useEffect(() => {
    (async () => {
      await Font.loadAsync({
        "cutive-mono-regular": require("../assets/fonts/CutiveMono-Regular.ttf"),
      });
      setFontLoaded(true)
    })();
    _askForPermissions();
  })
  // pedir por permissões
  const _askForPermissions = async () => {
    const response = await Audio.requestPermissionsAsync();
    setHaveRecordingPermissions(true)
  };
  // atualizar tela para o status do som
  const _updateScreenForSoundStatus = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setMuted(status.isMuted)
      setIsPlaybackAllowed(true)
    } else {
      setIsPlaybackAllowed(false)
      if (status.error) {
        console.log(`FATAL PLAYER ERROR: ${status.error}`);
      }
    }
  };
  // atualizar status na tela para a gravação
  const _updateScreenForRecordingStatus = (status: Audio.RecordingStatus) => {
    if (status.canRecord) {
      setIsRecording(status.isRecording)
      setRecordingDuration(status.durationMillis)
    } else if (status.isDoneRecording) {
      setIsRecording(false)
      setRecordingDuration(status.durationMillis)
      if (!isLoading) {
        _stopRecordingAndEnablePlayback();
      }
    }
  };
  // Parar playback e começar a gravar
  async function _stopPlaybackAndBeginRecording() {
    setIsLoading(true)
    if (sound !== null) {
      await sound.unloadAsync();
      sound.setOnPlaybackStatusUpdate(null);
      setSound(null)
    }

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: true,
    });

    const recording = new Audio.Recording();

    if (recording !== null) {
      recording.setOnRecordingStatusUpdate(null);
      setRecording(null)
    }

    await recording.prepareToRecordAsync(recordingSettings);
    recording.setOnRecordingStatusUpdate(_updateScreenForRecordingStatus);
    setRecording(recording)
    await recording.startAsync();
    
    setIsLoading(false)
  }
  // Parar de gravar e ativar playback
  async function _stopRecordingAndEnablePlayback() {
    // console.log(recording)
    setIsLoading(true)
    if (!recording) {
      return;
    }
    try {
      await recording.stopAndUnloadAsync();
    } catch (error) {

      if (error.code === "E_AUDIO_NODATA") {
        console.log(`Stop was called too quickly, no data has yet been received (${error.message})`);
        alert('Parou a gravação muito rápido, não foi possível salvar nenhum dado.')
      } else {
        console.log("STOP ERROR: ", error.code, error.name, error.message);
      }
      setIsLoading(false)
      return;
    }
    const info = await FileSystem.getInfoAsync(recording.getURI() || "");
    info.uri
    console.log(`FILE INFO: ${JSON.stringify(info)}`);
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: true,
    });
    let { sound } = await recording.createNewLoadedSoundAsync(
      {
        isLooping: true,
        isMuted: muted,
      },
      _updateScreenForSoundStatus
    );
    sound = sound;
    const path = FileSystem.documentDirectory + 'audio/'
    const dirInfo = await FileSystem.getInfoAsync(path)
    dirInfo.exists ? undefined : await FileSystem.makeDirectoryAsync(path, { intermediates: true }).then(() => console.log('diretorio de audio criado com sucesso'))
    setIsLoading(false)
    setSound(null)
  }

  async function _uploadSoundToStorage() {
    if ((await netinfo.fetch()).isConnected) {
        const info = await FileSystem.getInfoAsync(recording?.getURI() || "");
        const response = await fetch(info.uri)
        const blob = await response.blob()
        const storage = fb.storage()
        const db = fb.database()
        await storage.ref().child(`/audio-de-apr/${apr?.OT_OS_SI}/${apr?.id}`).put(blob, { contentType: 'audio/*' })
        const audioLink = await storage.ref().child(`/audio-de-apr/${apr?.OT_OS_SI}/${apr?.id}`).getDownloadURL()
        const APRData: APRProps = {
          ContratoId: Number(apr?.ContratoId),
          ProcessoId: Number(apr?.ProcessoId),
          UsuarioId: Number(apr?.UsuarioId),
          EquipeId: apr?.EquipeId,
          OT_OS_SI: Number(apr?.OT_OS_SI),
          DataHoraAPR: String(apr?.DataHoraAPR),
          CoordenadaX: Number(apr?.CoordenadaX),
          CoordenadaY: Number(apr?.CoordenadaY),
          hiperlink: audioLink,
          id: Number(apr?.id)
        }
        await db.ref(`/APR/${APRData.id}`).set(APRData)
        navigation.navigate('MenuDeSeguranca')
    } else {
      netinfo.addEventListener(async state => {
        if (state.isConnected) {
          const info = await FileSystem.getInfoAsync(recording?.getURI() || "");
          const response = await fetch(info.uri)
          const blob = await response.blob()
          const storage = fb.storage()
          const db = fb.database()
          await storage.ref().child(`/audio-de-apr/${apr?.OT_OS_SI}/${apr?.id}`).put(blob)
          const audioLink = await storage.ref().child(`/audio-de-apr/${apr?.OT_OS_SI}/${apr?.id}`).getDownloadURL()
          const APRData: APRProps = {
            ContratoId: Number(apr?.ContratoId),
            ProcessoId: Number(apr?.ProcessoId),
            UsuarioId: Number(apr?.UsuarioId),
            EquipeId: apr?.EquipeId,
            OT_OS_SI: Number(apr?.OT_OS_SI),
            DataHoraAPR: String(apr?.DataHoraAPR),
            CoordenadaX: Number(apr?.CoordenadaX),
            CoordenadaY: Number(apr?.CoordenadaY),
            id: Number(apr?.id),
            hiperlink: audioLink
          }
          await db.ref(`/APR/${APRData.id}`).set(APRData)
          navigation.navigate('ListaDeAPR')
        }
      })
    }
  }
  // quando o botao de gravar for pressionado
  const _onRecordPressed = () => {
    if (isRecording) {
      _stopRecordingAndEnablePlayback();
    } else {
      _stopPlaybackAndBeginRecording();
    }
  };

  const _getMMSSFromMillis = (millis: number) => {
    const totalSeconds = millis / 1000;
    const seconds = Math.floor(totalSeconds % 60);
    const minutes = Math.floor(totalSeconds / 60);
    const padWithZero = (number: number) => {
      const string = number.toString();
      if (number < 10) {
        return "0" + string;
      }
      return string;
    };
    return padWithZero(minutes) + ":" + padWithZero(seconds);
  }

  const _getRecordingTimestamp = () => {
    if (recordingDuration != null) {
      return `${_getMMSSFromMillis(recordingDuration)}`;
    }
    return `${_getMMSSFromMillis(0)}`;
  }

  if (!fontLoaded) {
    // se a fonte nao for carregada
    return <View style={styles.emptyContainer} />;
  }

  // senão tiver permissão para gravar o audio
  if (!haveRecordingPermissions) {
    return (
      <View style={styles.container}>
        <View />
        <Text
          style={[
            styles.noPermissionsText,
            { fontFamily: "cutive-mono-regular" },
          ]}
        >
          You must enable audio recording permissions in order to use this
          app.
        </Text>
        <View />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.halfScreenContainer,
          {
            opacity: isLoading ? DISABLED_OPACITY : 1.0,
          },
        ]}
      >
        <View />
        {/* <Text>Aperte aqui para começar a gravar.</Text> */}
        <View style={styles.recordingContainer}>
          <View />
          <TouchableHighlight
            underlayColor={BACKGROUND_COLOR}
            // style={styles.wrapper}
            onPress={_onRecordPressed}
            disabled={isLoading}
          >
            <Image style={styles.image} source={!isRecording ? Icons.RECORD_BUTTON.module : Icons.STOP_BUTTON.module} />
          </TouchableHighlight>
          <View style={styles.recordingDataContainer}>
            <View />
            <Text
              style={[styles.liveText, { fontFamily: "cutive-mono-regular" }]}
            >
              {isRecording ? "LIVE" : ""}
            </Text>
            <View style={styles.recordingDataRowContainer}>
              <Image
                style={[
                  styles.image,
                  { opacity: isRecording ? 1.0 : 0.0 },
                ]}
                source={Icons.RECORDING.module}
              />
              <Text
                style={[
                  styles.recordingTimestamp,
                  { fontFamily: "cutive-mono-regular" },
                ]}
              >
                {_getRecordingTimestamp()}
              </Text>
            </View>
            <View />
          </View>
          <View />
        </View>
        <Botao texto="Enviar" onPress={() => _uploadSoundToStorage().then(() => alert('APR enviada com sucesso.'))} disabled={recording !== null && recording._isDoneRecording ? false : true}/>
        <View />
      </View>
      <View
        style={[
          styles.halfScreenContainer,
          {
            opacity:
              !isPlaybackAllowed || isLoading
                ? DISABLED_OPACITY
                : 1.0,
          },
        ]}
      >
        <View />
        <View
          style={[styles.buttonsContainerBase, styles.buttonsContainerTopRow]}
        >
          <View style={styles.playStopContainer}>
          </View>
          <View />
        </View>
        <View
          style={[
            styles.buttonsContainerBase,
            styles.buttonsContainerBottomRow,
          ]}
        >
        </View>
        <View />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    alignSelf: "stretch",
    backgroundColor: BACKGROUND_COLOR,
  },
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: BACKGROUND_COLOR,
    minHeight: DEVICE_HEIGHT,
    maxHeight: DEVICE_HEIGHT,
  },
  noPermissionsText: {
    textAlign: "center",
  },
  // wrapper: {},
  halfScreenContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
    minHeight: DEVICE_HEIGHT / 1.0,
    maxHeight: DEVICE_HEIGHT / 1.0,
  },
  recordingContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
    minHeight: Icons.RECORD_BUTTON.height,
    maxHeight: Icons.RECORD_BUTTON.height,
  },
  recordingDataContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: Icons.RECORD_BUTTON.height,
    maxHeight: Icons.RECORD_BUTTON.height,
    minWidth: Icons.RECORD_BUTTON.width * 3.0,
    maxWidth: Icons.RECORD_BUTTON.width * 3.0,
  },
  recordingDataRowContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: Icons.RECORDING.height,
    maxHeight: Icons.RECORDING.height,
  },
  playbackContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
    minHeight: Icons.THUMB_1.height * 2.0,
    maxHeight: Icons.THUMB_1.height * 2.0,
  },
  playbackSlider: {
    alignSelf: "stretch",
  },
  liveText: {
    color: LIVE_COLOR,
  },
  recordingTimestamp: {
    paddingLeft: 20,
  },
  playbackTimestamp: {
    textAlign: "right",
    alignSelf: "stretch",
    paddingRight: 20,
  },
  image: {
    backgroundColor: BACKGROUND_COLOR,
  },
  textButton: {
    backgroundColor: BACKGROUND_COLOR,
    padding: 10,
  },
  buttonsContainerBase: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonsContainerTopRow: {
    maxHeight: Icons.MUTED_BUTTON.height,
    alignSelf: "stretch",
    paddingRight: 20,
  },
  playStopContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minWidth: ((Icons.PLAY_BUTTON.width + Icons.STOP_BUTTON.width) * 3.0) / 2.0,
    maxWidth: ((Icons.PLAY_BUTTON.width + Icons.STOP_BUTTON.width) * 3.0) / 2.0,
  },
  volumeContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minWidth: DEVICE_WIDTH / 2.0,
    maxWidth: DEVICE_WIDTH / 2.0,
  },
  volumeSlider: {
    width: DEVICE_WIDTH / 2.0 - Icons.MUTED_BUTTON.width,
  },
  buttonsContainerBottomRow: {
    maxHeight: Icons.THUMB_1.height,
    alignSelf: "stretch",
    paddingRight: 20,
    paddingLeft: 20,
  },
  timestamp: {
    fontFamily: "cutive-mono-regular",
  },
  rateSlider: {
    width: DEVICE_WIDTH / 2.0,
  },
});