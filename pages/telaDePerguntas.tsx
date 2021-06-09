import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import InspecaoContext from '../contexts/inspecao';
import fb from '../services/firebase'

interface objetoDePergunta {
  contratosId: Array<number>,
  grupo: string,
  id: number,
  pergunta: string,
  processosId: Array<number>
}

const TelaDePerguntas: React.FC = () => {
  const [listaPerguntas, setListaPerguntas] = useState<Array<objetoDePergunta>>([])
  const { ContratoId, ProcessoId, inspecaoId } = useContext(InspecaoContext)
  const [indicePerguntaAtual, setIndicePerguntaAtual] = useState<number>(0)
  const [perguntaAtual, setPerguntaAtual] = useState<string>()
  const [disabled, setDisabled] = useState(false)
  const navigation = useNavigation()
  const db = fb.database()

  function handleNextQuestion() {
    try {
      if(indicePerguntaAtual == listaPerguntas.length - 1) {
        setPerguntaAtual("Inspeção finalizada.")
        setDisabled(true)
        return
      }
      setPerguntaAtual(listaPerguntas[indicePerguntaAtual + 1].pergunta); 
      setIndicePerguntaAtual(indicePerguntaAtual + 1);
      console.log(`${indicePerguntaAtual + 1}/${listaPerguntas.length}`)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    async function getPerguntas() {
      await db.ref('/perguntas-de-seguranca').on('value', (snap: any) => {
        const perguntasJSON = snap.val()
        if (perguntasJSON) {
          const keys = Object.keys(perguntasJSON)
          let perguntas: objetoDePergunta[] = []
          keys.forEach(key => {
            const dataPerguntas = perguntasJSON[key]
            const processoEncontrado = dataPerguntas.processosId.find((item: number) => {
              return item === ProcessoId
            })
            const contratoEncontrado = dataPerguntas.contratosId.find((item: number) => {
              return item === ContratoId
            })
            if (processoEncontrado && contratoEncontrado)
              perguntas.push(dataPerguntas)
          })
          setListaPerguntas(perguntas)
          setPerguntaAtual(perguntas[indicePerguntaAtual]?.pergunta)
        }
      })
    }
    getPerguntas()
  }, [])

  return (
    <>
      <View style={style.campoDePergunta}>
        <Text>{perguntaAtual}</Text>
      </View>
      <View style={style.container}>
        <View style={style.containerHorizontal}>
          <View style={style.buttonContainer}>
            <Button title="Sim" onPress={handleNextQuestion} disabled={disabled}/>
          </View>
          <View style={style.buttonContainer}>
            <Button title="Não" onPress={() => navigation.navigate('NaoConformidades')} disabled={disabled}/>
          </View>
          <View style={style.buttonContainer}>
            <Button title="N/A" onPress={handleNextQuestion} disabled={disabled}/>
          </View>
        </View>
      </View>
    </>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerHorizontal: {
    flexDirection: 'row',
    marginHorizontal: 100
  },
  buttonContainer: {
    flex: 1,
    marginHorizontal: 5
  },
  campoDePergunta: {
    borderWidth: 4,
    borderRadius: 10,
    padding: 100,
    maxWidth: 550,
    marginTop: 60,
    marginHorizontal: 25
  }
})

export default TelaDePerguntas;