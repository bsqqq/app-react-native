import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import InspecaoContext from '../contexts/inspecao';
import NaoConformidadesContext from '../contexts/NaoConformidades'
import fb from '../services/firebase'

interface objetoDePergunta {
  contratosId: Array<number>,
  grupo: string,
  id: number,
  pergunta: string,
  processosId: Array<number>
}

interface objetoDeResposta {
  inspecaoId: number | undefined,
  valorResposta: string,
  perguntaId: number,
  respostaId: number,
  status?: string
}

const TelaDePerguntas: React.FC = () => {
  const [listaPerguntas, setListaPerguntas] = useState<Array<objetoDePergunta>>([])
  const { ContratoId, ProcessoId, inspecaoId } = useContext(InspecaoContext)
  const [indicePerguntaAtual, setIndicePerguntaAtual] = useState<number>(0)
  const { setRespostaIdContext } = useContext(NaoConformidadesContext)
  const [perguntaAtual, setPerguntaAtual] = useState<string>()
  const [disabled, setDisabled] = useState(false)
  const objDeResp: objetoDeResposta[] = []
  const navigation = useNavigation()
  const db = fb.database()

  function handleNextQuestion(decisao: string) {
    try {
      if (indicePerguntaAtual == listaPerguntas.length - 1) {
        setPerguntaAtual("Inspeção finalizada.")
        setDisabled(true)
        return
      }
      if (decisao == 'sim') {
        setPerguntaAtual(listaPerguntas[indicePerguntaAtual + 1].pergunta);
        setIndicePerguntaAtual(indicePerguntaAtual + 1);
        let resposta: objetoDeResposta = {
          inspecaoId,
          perguntaId: listaPerguntas[indicePerguntaAtual].id,
          respostaId: new Date().getTime(),
          valorResposta: decisao,
          status: 'ok'
        }
        objDeResp.push(resposta)
      } else if (decisao == 'nao') {
        let resposta: objetoDeResposta = {
          inspecaoId,
          perguntaId: listaPerguntas[indicePerguntaAtual].id,
          respostaId: new Date().getTime(),
          valorResposta: decisao,
          status: 'pendente'
        }
        setRespostaIdContext(resposta.respostaId)
        objDeResp.push(resposta)
        setPerguntaAtual(listaPerguntas[indicePerguntaAtual + 1].pergunta);
        setIndicePerguntaAtual(indicePerguntaAtual + 1);
        navigation.navigate('NaoConformidades')
      }
      else {
        // caso escolha N/A
      }
      console.log(`${indicePerguntaAtual + 1}/${listaPerguntas.length}`)
      console.log(objDeResp)

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
            <Button title="Sim" onPress={() => handleNextQuestion('sim')} disabled={disabled} />
          </View>
          <View style={style.buttonContainer}>
            <Button title="Não" onPress={() => handleNextQuestion('nao')} disabled={disabled} />
          </View>
          <View style={style.buttonContainer}>
            <Button title="N/A" onPress={() => handleNextQuestion('n/a')} disabled={disabled} />
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
    marginHorizontal: 5,
  },
  campoDePergunta: {
    borderWidth: 4,
    borderRadius: 10,
    padding: 100,
    maxWidth: 550,
    marginTop: 60,
    marginHorizontal: 25,
    alignSelf: 'center',
    fontWeight: 'bold'
  }
})

export default TelaDePerguntas;