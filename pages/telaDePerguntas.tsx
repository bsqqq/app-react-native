import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import InspecaoContext from '../contexts/inspecao';
import NaoConformidadesContext from '../contexts/NaoConformidades'
import fb from '../services/firebase'
import Buttom from '../components/NextButton'

interface objetoDePergunta {
  processosId: Array<number>
  contratosId: Array<number>,
  pergunta: string,
  grupo: string,
  id: number,
}

interface objetoDeResposta {
  NaoConformidades?: Array<string>
  inspecaoId: number | undefined,
  valorResposta: string,
  perguntaId: number,
  respostaId: number,
  status: string,
}

const TelaDePerguntas: React.FC = () => {
  const { setRespostaIdContext, finishInspecao } = useContext(NaoConformidadesContext)
  const [listaPerguntas, setListaPerguntas] = useState<Array<objetoDePergunta>>([])
  const [listaRespostas, setListaRespostas] = useState<Array<objetoDeResposta>>([])
  const { ContratoId, ProcessoId, inspecaoId } = useContext(InspecaoContext)
  const [indicePerguntaAtual, setIndicePerguntaAtual] = useState<number>(0)
  const [proximaPergunta, setProximaPergunta] = useState<string>()
  const [disabled, setDisabled] = useState(false)
  const navigation = useNavigation()
  const db = fb.database()

  function handleNextQuestion(decisao: string) {
    const objDeResp: objetoDeResposta[] = listaRespostas
    try {
      if (decisao == 'sim') {
        let resposta: objetoDeResposta = {
          respostaId: new Date().getTime(),
          inspecaoId,
          perguntaId: listaPerguntas[indicePerguntaAtual].id,
          valorResposta: decisao,
          status: 'ok'
        }
        setProximaPergunta(indicePerguntaAtual + 1 !== listaPerguntas.length ? listaPerguntas[indicePerguntaAtual + 1].pergunta : 'Inspeção finalizada.');
        setIndicePerguntaAtual(indicePerguntaAtual + 1);
        objDeResp.push(resposta)
        setListaRespostas(objDeResp)
        console.log(objDeResp)
      }
      else if (decisao == 'nao') {
        let resposta: objetoDeResposta = {
          respostaId: new Date().getTime(),
          inspecaoId,
          perguntaId: listaPerguntas[indicePerguntaAtual].id,
          valorResposta: decisao,
          status: 'pendente'
        }
        setRespostaIdContext(resposta.respostaId)
        objDeResp.push(resposta)
        setListaRespostas(objDeResp)
        setProximaPergunta(indicePerguntaAtual + 1 !== listaPerguntas.length ? listaPerguntas[indicePerguntaAtual + 1].pergunta : 'Inspeção finalizada.');
        setIndicePerguntaAtual(indicePerguntaAtual + 1);
        console.log(objDeResp)
        navigation.navigate('NaoConformidades')
      }
      else {
        // caso escolha N/A
      }
      if (indicePerguntaAtual + 1 === listaPerguntas.length) {
        setDisabled(true)
      }

    } catch (error) {
      console.log(error)
      alert(error)
    }
  }

  function handleEnvioDeInspecao() {
    console.log('apertou aqui')
    // escrita para o storage com o array de fotos
    finishInspecao()
    navigation.navigate('Inspecao')
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
          setProximaPergunta(perguntas[indicePerguntaAtual]?.pergunta)
        }
      })
    }
    getPerguntas()
  }, [])

  return (
    <>
      <View style={style.campoDePergunta}>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          {indicePerguntaAtual + 1 <= listaPerguntas.length
            ? <Text>Pergunta {indicePerguntaAtual + 1} de {listaPerguntas.length}:</Text>
            : undefined
          }
        </View>
        <Text>{proximaPergunta}</Text>
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
        <View style={{}}>
          <Buttom texto='Enviar' disabled={!disabled} onPress={handleEnvioDeInspecao} />
        </View>
        <Text style={{fontStyle: 'italic'}}>Certifique-se de que este dispositivo está com carga suficiente até o fim desta inspeção.</Text>
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
    marginHorizontal: 100,
    marginBottom: 400
  },
  buttonContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  campoDePergunta: {
    borderWidth: 5,
    borderRadius: 10,
    padding: 100,
    // maxWidth: 500,
    marginTop: 60,
    marginHorizontal: 25,
    alignSelf: 'center',
    fontWeight: 'bold'
  }
})

export default TelaDePerguntas;