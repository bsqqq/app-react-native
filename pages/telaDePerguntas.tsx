import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import fb from '../services/firebase'

// import { Container } from './styles';

const TelaDePerguntas: React.FC = () => {
  const db = fb.database()
  const [perguntaAtual, setPerguntaAtual] = useState<string>()
  async function getPerguntas(): Promise<string> {
    const snap = await db.ref('/perguntas-de-seguranca').on('value', (snap: any) => {
      const perguntasJSON = snap.exportVal()
      var lista = []
      if(perguntasJSON) {
        const keys = Object.keys(perguntasJSON)
        let perguntas: string[]
        keys.forEach(key => {
          var i = 0
          perguntas[i] = perguntasJSON[key].pergunta
          i++
          setPerguntaAtual(pergunta)
        })
      }
    })
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