import React, { useContext, useState, useEffect } from 'react'
import { View, Text, StyleSheet, Button } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import InspecaoContext from '../contexts/inspecao'
import Buttom from '../components/NextButton'
import * as fs from 'expo-file-system'

interface objetoDePergunta {
  processosId: Array<number>
  contratosId: Array<number>,
  pergunta: string,
  grupo: string,
  id: number,
}

interface objetoDeResposta {
  inspecaoId: number | undefined,
  valorResposta: string,
  perguntaId: number,
  respostaId: number,
  status?: string,
}

const TelaDePerguntas: React.FC = () => {
  const { finishInspecao, setRespId } = useContext(InspecaoContext)
  const [listaPerguntas, setListaPerguntas] = useState<Array<objetoDePergunta>>([])
  const [listaRespostas, setListaRespostas] = useState<Array<objetoDeResposta>>([])
  const { ContratoId, ProcessoId, inspecaoId } = useContext(InspecaoContext)
  const [indicePerguntaAtual, setIndicePerguntaAtual] = useState<number>(0)
  const [proximaPergunta, setProximaPergunta] = useState<string>()
  const [voltarDisabled, setVoltarDisabled] = useState(true)
  const [disabled, setDisabled] = useState(false)
  const navigation = useNavigation()
  var objDeResp: objetoDeResposta[]

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
            status: 'ok'
          }
          setProximaPergunta(indicePerguntaAtual + 1 !== listaPerguntas.length ? listaPerguntas[indicePerguntaAtual + 1].pergunta : 'Inspeção finalizada.')
          setIndicePerguntaAtual(indicePerguntaAtual + 1)
          var jaExisteResposta = objDeResp.find(objetoDeResposta => {
            return objetoDeResposta.perguntaId === respostaSim.perguntaId
          })

          if (jaExisteResposta != undefined)
            objDeResp[objDeResp.indexOf(jaExisteResposta)] = respostaSim
          else
            objDeResp.push(respostaSim)

          setListaRespostas(objDeResp)
          console.log(objDeResp)
          console.log(`indice pergunta atual: ${indicePerguntaAtual}`)
          setVoltarDisabled(false)
          break;
        case 'nao':
          let respostaNao: objetoDeResposta = {
            respostaId: new Date().getTime(),
            inspecaoId,
            perguntaId: listaPerguntas[indicePerguntaAtual].id,
            valorResposta: decisao,
            status: 'pendente'
          }
          var jaExisteRespostaa = objDeResp.find(objetoDeResposta => {
            return objetoDeResposta.perguntaId === respostaNao.perguntaId
          })

          if (jaExisteRespostaa != undefined)
            objDeResp[objDeResp.indexOf(jaExisteRespostaa)] = respostaNao
          else {
            setRespId(respostaNao.respostaId)
            objDeResp.push(respostaNao)
          }
          setListaRespostas(objDeResp)
          setProximaPergunta(indicePerguntaAtual + 1 !== listaPerguntas.length ? listaPerguntas[indicePerguntaAtual + 1].pergunta : 'Inspeção finalizada.');
          setIndicePerguntaAtual(indicePerguntaAtual + 1);
          console.log(objDeResp)
          console.log(`indice pergunta atual: ${indicePerguntaAtual}`)
          setVoltarDisabled(false)
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
          setVoltarDisabled(false)
          console.log(`indice pergunta atual: ${indicePerguntaAtual}`)
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

  function handleEnvioDeInspecao() {
    finishInspecao()
    navigation.navigate('Inspecao')
  }

  function goBack() {
    if (indicePerguntaAtual == 0)
      setVoltarDisabled(true)
    else
      setVoltarDisabled(false)
    setProximaPergunta(indicePerguntaAtual == 0 ? listaPerguntas[indicePerguntaAtual].pergunta : listaPerguntas[indicePerguntaAtual - 1].pergunta)
    setIndicePerguntaAtual(indicePerguntaAtual == 0 ? indicePerguntaAtual : indicePerguntaAtual - 1)
  }

  useEffect(() => {
    async function getPerguntas() {
      var path = fs.documentDirectory + 'json/'
      const fileUri = (jsonId: string) => path + `${jsonId}.json`
      const perguntasJSON = JSON.parse(await fs.readAsStringAsync(fileUri('perguntas-de-seguranca')))
      console.log(perguntasJSON)
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
        <View style={{flexDirection: 'row', justifyContent: 'space-around', marginHorizontal: 30}}>
          <Button title='voltar pergunta' onPress={goBack} disabled={voltarDisabled} />
          <Button title='acançar pergunta' onPress={goBack} disabled={voltarDisabled} />
        </View>
        <View>
          <Buttom texto='Enviar' disabled={!disabled} onPress={handleEnvioDeInspecao} />
        </View>
        <Text style={{ fontStyle: 'italic' }}>Certifique-se de que este dispositivo está com carga suficiente até o fim desta inspeção.</Text>
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
    marginTop: 60,
    marginHorizontal: 25,
    alignSelf: 'center',
    fontWeight: 'bold'
  }
})

export default TelaDePerguntas;