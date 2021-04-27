import * as React from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { Audio } from 'expo-av'

export default function App() {
  const [recording, setRecording] = React.useState();
  let millis

  async function startRecording() {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
        staysActiveInBackground: true,
        playThroughEarpieceAndroid: true,
        shouldDuckAndroid: true,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX
      }); 
      console.log('Starting recording..');

      const newRecording = new Audio.Recording()
      setRecording(newRecording)
      await newRecording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY)
      newRecording.setOnRecordingStatusUpdate(status => {
        const { durationMillis } = status
        millis = durationMillis
      })
      await newRecording.startAsync()
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    if(!recording) {
      console.log("Não está gravando...")
      return {}
    }
    try {
      const { status } = await recording.getStatusAsync()
      await recording.stopAndUnloadAsync()
      const Obj = {
        URI: recording.getURI(),
        Millis: millis,
        status: status
      }
      console.log('Stopping recording..');
      console.log('Recording stopped and stored at', Obj.URI);
      console.log(Obj)
      setRecording(false);
      return Obj
    } catch (error) {
      console.log(error)
    }
    
  }

  return (
    <View style={styles.container}>
      <Text>{recording ? 'Stop Recording' : 'Start Recording'}</Text>
      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'space-around'
  }
})