import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import fb from '../services/firebase'

// import { Container } from './styles';

const TelaDePerguntas: React.FC = () => {
  const db = fb.database()
  async function getPerguntas(): Promise<string> {
    const snap = await db.ref()
  }
  return(
      <View style={style.container}>
        <Text>TelaDePerguntas.tsx</Text>

      </View>
  ) 
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default TelaDePerguntas;