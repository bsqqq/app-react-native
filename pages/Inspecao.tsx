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
import fb from "../services/firebase";
import { InspecaoContextData } from "../contexts/inspecao";
import AuthContext from "../contexts/auth";
import * as fs from 'expo-file-system'

interface InspecoesDataResolvidas {
  [index: string]: InspecaoContextData;
}

export default function Inspecao() {
  const db = fb.database();
  var path = fs.documentDirectory + 'json/'
  const fileUri = (jsonId: string) => path + `${jsonId}.json`
  var inspecoesKeys: string[];
  var contratosKeys: string[];
  var processosKeys: string[];
  const { user } = useContext(AuthContext)
  const [inspecoes, setInspecoes] = useState<Array<InspecaoContextData>>([]);
  useEffect(() => {
    async function getInspecoes() {
      const snap = await db.ref(`/inspecoes`).once("value");
      const shot: InspecoesDataResolvidas = snap.exportVal();
      const arrayDeTratamento: Array<InspecaoContextData> = [];
      inspecoesKeys = Object.keys(shot);

      const snapDeContratos = await db.ref("/empresas").once("value");
      const shotDeContratos = snapDeContratos.exportVal();
      const arrayDeContratos: Array<any> = [];
      contratosKeys = Object.keys(shotDeContratos);
      contratosKeys.forEach(key => {
        arrayDeContratos.push(shotDeContratos[key]);
      });

      const snapDeProcessos = await db.ref("/processos").once("value");
      const shotDeProcessos = snapDeProcessos.exportVal();
      const fsInspecoes = fs.readAsStringAsync(fileUri('inspecoes'))
      console.log(`fsInspecoes: ${fsInspecoes}`)
      console.log(`shotDeInspeções: ${shot}`)
      const arrayDeProcessos: Array<any> = [];
      processosKeys = Object.keys(shotDeProcessos);
      processosKeys.forEach(key => {
        arrayDeProcessos.push(shotDeProcessos[key]);
      });

      inspecoesKeys.forEach(key => {
        var tal = shot[key];
        if (tal.Inspetor === user?.name) {
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
  const navigation = useNavigation();
  return (
    <SafeAreaView style={style.container}>
      <ScrollView>
        {inspecoes.map((inspecao) => {
          return (
            <ItemInspecao
              key={inspecao.id}
              DataEHoraDaInspecao={inspecao.DataEHoraDaInspecao}
              NumeroDeInspecao={inspecao.NumeroDeInspecao}
              OT_OS_SI={inspecao.OT_OS_SI}
              Inspetor={inspecao.Inspetor}
              ContratoId={inspecao.ContratoId}
              ProcessoId={inspecao.ProcessoId}
            />
          );
        })}
      </ScrollView>
      <View style={style.buttonPosition}>
        <TouchableOpacity
          style={style.button}
          onPress={() => navigation.navigate("NovaInspeção")}
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
    marginVertical: 50,
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
