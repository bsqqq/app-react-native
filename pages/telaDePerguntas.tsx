import React, { useContext, useState, useEffect } from 'react'
import { View, Text, StyleSheet, Button, Dimensions } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import InspecaoContext from '../contexts/inspecao'
import Buttom from '../components/NextButton'
import * as fs from 'expo-file-system'

interface objetoDePergunta {
  processosId: Array<number>
  contratosId: Array<number>
  pergunta: string
  grupo: string
  id: number
}

type objetoDeResposta = {
  inspecaoId: number | undefined
  valorResposta: string
  perguntaId: number
  respostaId: number
  status?: string
}

const TelaDePerguntas: React.FC = () => {
  const { ContratoId, ProcessoId, inspecaoId, setListaDeRespostaContext, setChecklistContext } = useContext(InspecaoContext)
  const [listaPerguntas, setListaPerguntas] = useState<Array<objetoDePergunta>>([])
  const [listaRespostas, setListaRespostas] = useState<Array<objetoDeResposta>>([])
  const [indicePerguntaAtual, setIndicePerguntaAtual] = useState<number>(0)
  const { finishInspecao, setRespId } = useContext(InspecaoContext)
  const [proximaPergunta, setProximaPergunta] = useState<string>()
  const [disabled, setDisabled] = useState(false)
  const navigation = useNavigation()
  var objDeResp: objetoDeResposta[]
  const routes = useRoute()

  function handleNextQuestion(decisao: string) {
    objDeResp = listaRespostas
    try {
      switch (decisao) {
        case 'sim':
          let respostaSim: objetoDeResposta = {
            respostaId: new Date().getTime(),
            inspecaoId,
            perguntaId: listaPerguntas[indicePerguntaAtual].id,
            valorResposta: decisao,
            status: 'ok',
          }
          setProximaPergunta(indicePerguntaAtual + 1 !== listaPerguntas.length ? listaPerguntas[indicePerguntaAtual + 1].pergunta : 'Inspeção finalizada.')
          setIndicePerguntaAtual(indicePerguntaAtual + 1)
          var jaExisteResposta = objDeResp.find(objetoDeResposta => objetoDeResposta.perguntaId === respostaSim.perguntaId)
          if (jaExisteResposta != undefined)
            objDeResp[objDeResp.indexOf(jaExisteResposta)] = respostaSim
          else
            objDeResp.push(respostaSim)
          setListaRespostas(objDeResp)
          setListaDeRespostaContext(listaRespostas[listaRespostas.length - 1])
          console.log(objDeResp)
          console.log(`indice pergunta atual: ${indicePerguntaAtual}`)
          break;
        case 'nao':
          let respostaNao: objetoDeResposta = {
            respostaId: new Date().getTime(),
            inspecaoId,
            perguntaId: listaPerguntas[indicePerguntaAtual].id,
            valorResposta: decisao,
            status: 'pendente',
          }
          var jaExisteRespostaa = objDeResp.find(objetoDeResposta => objetoDeResposta.perguntaId === respostaNao.perguntaId)
          if (jaExisteRespostaa != undefined)
            objDeResp[objDeResp.indexOf(jaExisteRespostaa)] = respostaNao
          else {
            setRespId(respostaNao.respostaId)
            objDeResp.push(respostaNao)
          }
          setListaRespostas(objDeResp)
          setProximaPergunta(indicePerguntaAtual + 1 !== listaPerguntas.length ? listaPerguntas[indicePerguntaAtual + 1].pergunta : 'Inspeção finalizada.');
          setIndicePerguntaAtual(indicePerguntaAtual + 1);
          setListaDeRespostaContext(listaRespostas[listaRespostas.length - 1])
          console.log(objDeResp)
          console.log(`indice pergunta atual: ${indicePerguntaAtual}`)
          navigation.navigate('NaoConformidades')
          break;
        case 'n/a':
          let resposta: objetoDeResposta = {
            respostaId: new Date().getTime(),
            inspecaoId,
            perguntaId: listaPerguntas[indicePerguntaAtual].id,
            valorResposta: decisao,
            status: "n/a"
          }
          setRespId(resposta.respostaId)
          objDeResp.push(resposta)
          setListaRespostas(objDeResp)
          setProximaPergunta(indicePerguntaAtual + 1 !== listaPerguntas.length ? listaPerguntas[indicePerguntaAtual + 1].pergunta : 'Inspeção finalizada.')
          setIndicePerguntaAtual(indicePerguntaAtual + 1)
          break;
        default:
          break;
      }
      if (indicePerguntaAtual + 1 === listaPerguntas.length)
        setDisabled(true)

    } catch (error) {
      console.log(error)
      alert(error)
    }
  }

  function goBack() {
    setProximaPergunta(listaPerguntas[indicePerguntaAtual - 1].pergunta)
    setIndicePerguntaAtual(indicePerguntaAtual - 1)
    if (disabled == true)
      setDisabled(false)
  }

  function goFoward() {
    setProximaPergunta(listaPerguntas[indicePerguntaAtual + 1].pergunta)
    setIndicePerguntaAtual(indicePerguntaAtual + 1)
  }

  function handleEnvioDeInspecao() {
    if (routes.params?.key == "inspecao") {
      setChecklistContext(false)
    } else {
      setChecklistContext(true)
    }
    finishInspecao()
    navigation.navigate('MenuDeSeguranca')
  }

  useEffect(() => {
    async function getPerguntas() {
      var path = fs.documentDirectory + 'json/'
      const fileUri = (jsonId: string): string => path + `${jsonId}.json`
      const perguntasJSON = JSON.parse(routes.params?.key !== 0 ? await fs.readAsStringAsync(fileUri('perguntas-de-seguranca')) : await fs.readAsStringAsync(fileUri('perguntas-de-checklist')))
      if (perguntasJSON) {
        const keys = Object.keys(perguntasJSON)
        let perguntas: objetoDePergunta[] = []
        keys.forEach(key => {
          const dataPerguntas = perguntasJSON[key]
          const arraysKeysProcessos = Object.keys(dataPerguntas.processosId)
          const arraysProcessos: number[] = []
          arraysKeysProcessos.forEach(item => {
            arraysProcessos.push(dataPerguntas.processosId[item])
          })
          const arraysKeysContratos = Object.keys(dataPerguntas.contratosId)
          const arraysContratos: number[] = []
          arraysKeysContratos.forEach(item => {
            arraysContratos.push(dataPerguntas.contratosId[item])
          })
          const processoEncontrado = arraysProcessos.find((item: number) => {
            return item === ProcessoId
          })
          const contratoEncontrado = arraysContratos.find((item: number) => {
            return item === ContratoId
          })
          if (processoEncontrado && contratoEncontrado)
            perguntas.push(dataPerguntas)
        })
        setListaPerguntas(perguntas)
        setProximaPergunta(perguntas[indicePerguntaAtual]?.pergunta)
      }
    }
    getPerguntas()
  }, [])

  return (
    <>
      <View style={style.campoDePergunta}>
        <View>
          {
            indicePerguntaAtual + 1 <= listaPerguntas.length
              ? <Text style={{ fontSize: 20 }}>Pergunta {indicePerguntaAtual + 1} de {listaPerguntas.length}:</Text>
              : undefined
          }
        </View>
        <Text style={{ textAlign: 'center', fontSize: 30 }}>{proximaPergunta}</Text>
      </View>
      <View style={style.container}>
        <View style={style.containerHorizontal}>
          <View style={style.buttonContainer}>
            <Button title="Conforme" onPress={() => handleNextQuestion('sim')} disabled={disabled} />
          </View>
          <View style={style.buttonContainer}>
            <Button title="Não Conforme" onPress={() => handleNextQuestion('nao')} disabled={disabled} />
          </View>
          <View style={style.buttonContainer}>
            <Button title="N/A" onPress={() => handleNextQuestion('n/a')} disabled={disabled} />
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 100 }}>
          <Button title='voltar' onPress={goBack} disabled={indicePerguntaAtual == 0} />
          <Button title='acançar' onPress={goFoward} disabled={indicePerguntaAtual > listaRespostas.length - 1} />
        </View>
        <View style={{ alignItems: 'center', justifyContent: 'center', position: 'relative', top: 50 }}>
          <Buttom texto='Enviar' disabled={!disabled} onPress={handleEnvioDeInspecao} />
        </View>
      </View>
    </>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    maxHeight: 550
  },
  containerHorizontal: {
    flexDirection: 'row',
    marginHorizontal: 10,
    position: 'absolute',
    top: 20
  },
  buttonContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  campoDePergunta: {
    borderWidth: 5,
    borderRadius: 10,
    paddingVertical: Dimensions.get('window').height * 0.05,
    paddingHorizontal: Dimensions.get('window').width * 0.1,
    marginTop: 60,
    marginHorizontal: 25,
    maxWidth: 400,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    // alignSelf: 'center',
    fontWeight: 'bold'
  }
})

export default TelaDePerguntas;