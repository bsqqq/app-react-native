import React, { useEffect, useState, useContext } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import ItemInspecao from "../components/itemInspecao";
import { InspecaoContextData } from "../contexts/inspecao";
import netinfo from '@react-native-community/netinfo'
import AuthContext from "../contexts/auth";
import fb from '../services/firebase'
import * as fs from 'expo-file-system'

export default function Inspecao() {
  const navigation = useNavigation();
  var path = fs.documentDirectory + 'json/'
  const fileUri = (jsonId: string) => path + `${jsonId}.json`
  var inspecoesKeys: string[];
  var contratosKeys: string[];
  var processosKeys: string[];
  const { user } = useContext(AuthContext)
  const [inspecoes, setInspecoes] = useState<Array<InspecaoContextData>>([]);
  const db = fb.database()
  useEffect(() => {
    async function getInspecoes() {
      const snap = await db.ref('/inspecoes').once('value')
      const shot = snap.exportVal()
      const inspecoesRecebidas = (await netinfo.fetch()).isConnected ? shot : JSON.parse(await fs.readAsStringAsync(fileUri('inspecoes')))
      const arrayDeTratamento: Array<InspecaoContextData> = [];
      inspecoesKeys = Object.keys(inspecoesRecebidas);

      const fsContratos = JSON.parse(await fs.readAsStringAsync(fileUri('contratos')))
      const arrayDeContratos: Array<any> = [];
      contratosKeys = Object.keys(fsContratos);
      contratosKeys.forEach(key => {
        arrayDeContratos.push(fsContratos[key]);
      });

      const fsProcessos = JSON.parse(await fs.readAsStringAsync(fileUri('processos')))
      const arrayDeProcessos: Array<any> = [];
      processosKeys = Object.keys(fsProcessos);
      processosKeys.forEach(key => {
        arrayDeProcessos.push(fsProcessos[key]);
      });

      inspecoesKeys.forEach(key => {
        var tal = inspecoesRecebidas[key];
        if (tal.InspetorId === user?.id) {
          var contratoEncontrado = arrayDeContratos.find(contrato => {
            var contratoEncontrado = Number(contrato.id) === Number(tal.ContratoId);
            return contratoEncontrado;
          });
          var ProcessoEncontrado = arrayDeProcessos.find(processo => {
            var processoEncontrado = Number(processo.id) === Number(tal.ProcessoId);
            return processoEncontrado;
          });
          tal.ContratoId = contratoEncontrado ? contratoEncontrado.nome : "-";
          tal.ProcessoId = ProcessoEncontrado ? ProcessoEncontrado.nome : "-";
          arrayDeTratamento.push(tal);
        }
      });
      setInspecoes(arrayDeTratamento);
    }
    getInspecoes();
  }, []);
  return (
    <SafeAreaView style={style.container}>
      <ScrollView>
      <Text>Lista de Inspe????es</Text>
        {inspecoes.length > 0 ? inspecoes?.map(inspecao => {
          return (
            <ItemInspecao
              id={inspecao.id}
              DataEHoraDaInspecao={inspecao.DataEHoraDaInspecao}
              NumeroDeInspecao={inspecao.NumeroDeInspecao}
              OT_OS_SI={inspecao.OT_OS_SI}
              Inspetor={inspecao.Inspetor}
              ContratoId={inspecao.ContratoId}
              ProcessoId={inspecao.ProcessoId}
              key={inspecao.id}
              redirect="InspecaoSelecionada"
            />
          );
        }) : <Text style={{
          alignItems: "center",
          justifyContent: "center"
        }}> N??o foram encontrados inspe????es para este usu??rio. </Text>
        }
      </ScrollView>
      <View style={style.buttonPosition}>
        <TouchableOpacity
          style={style.button}
          onPress={() => navigation.navigate("NovaInspe????o")}
        >
          <Text style={style.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 40,
  },
  button: {
    backgroundColor: "lightblue",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 40,
    height: 76,
    width: 76,
  },
  buttonText: {
    color: "white",
    fontSize: 35,
    paddingHorizontal: 21,
  },
  buttonPosition: {
    position: "absolute",
    alignSelf: "flex-end",
    bottom: 20,
    right: 20,
  },
  cards: {
    borderRadius: 20,
    borderColor: "black",
    borderWidth: 2,
    paddingHorizontal: Dimensions.get("window").width * 0.36,
    paddingVertical: 100,
    marginVertical: 5,
  },
});
