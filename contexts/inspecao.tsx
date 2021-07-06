import React, { createContext, useState, useContext } from 'react'
import * as Notifications from 'expo-notifications'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { estouOnline } from '../utils/EstouOnline';
import netinfo from '@react-native-community/netinfo'
import fb from '../services/firebase'
import NaoConformidadeContext from './NaoConformidades';

export interface InspecaoContextData {
    id?: number | undefined
    NumeroDeInspecao: number | undefined,
    DataEHoraDaInspecao: string | undefined,
    OT_OS_SI: number | undefined,
    MunicipioId: string | number | undefined,
    Localidade: string | undefined,
    CoordenadaX: string | number | undefined
    CoordenadaY: string | number | undefined,
    Inspetor: string | undefined,
    Placa: string | undefined,
    EquipeId: number[] | undefined,
    ContratoId: number | undefined,
    ProcessoId: number | undefined,
    inspecaoId: number | undefined,
    Inspecao: string | undefined,
    setProcessoContratoIdContextData(IdProcesso: number, idContrato: number): void,
    setInspecaoIdContextData(inspecaoId: number): void,
    setNewInspecao(inspecao: string): void,
    setFotosInspecao(FotoURI: string[]): Promise<void>,
    setEquipeIdContext(equipeId: number[] | undefined): void
    finishInspecao(): Promise<void>,
}

const InspecaoContext = createContext<InspecaoContextData>({} as InspecaoContextData)
export default InspecaoContext

export const InspecaoProvider: React.FC = ({ children }) => {
    const { respostaId } = useContext(NaoConformidadeContext)
    const [id, setId] = useState<number>()
    const [NumeroDeInspecao, setNumeroDeInspecao] = useState<number>()
    const [DataEHoraDaInspecao, setDataEHoraDaInspecao] = useState<string>()
    const [OT_OS_SI, setOT_OS_SI] = useState<number>()
    const [MunicipioId, setMunicipioId] = useState<number>()
    const [Localidade, setLocalidade] = useState<string>()
    const [CoordenadaX, setCoordenadaX] = useState<string>()
    const [CoordenadaY, setCoordenadaY] = useState<string>()
    const [Inspetor, setInspetor] = useState<string>()
    const [Placa, setPlaca] = useState<string>()
    const [EquipeId, setEquipeId] = useState<number[]>()
    const [ContratoId, setContratoId] = useState<number>()
    const [ProcessoId, setProcessoId] = useState<number>()
    const [inspecaoId, setInspecaoId] = useState<number>()
    const [Inspecao, setInspecao] = useState<string>()

    function setProcessoContratoIdContextData(processoId: number, contratoId: number) {
        setProcessoId(processoId)
        setContratoId(contratoId)
    }

    function setInspecaoIdContextData(inspecaoId: number) {
        setInspecaoId(inspecaoId)
    }

    function setNewInspecao(inspecao: string) {
        console.log(inspecao)
        setInspecao(inspecao)
    }

    async function setFotosInspecao(FotoURI: string[]) {
        await AsyncStorage.setItem('@mais-parceria-app-fotos', JSON.stringify(FotoURI))
    }

    function setEquipeIdContext(equipeId: number[]) {
        setEquipeId(equipeId)
    }

    async function finishInspecao() {
        // esta função vai escrever tudo no banco de dados.
        try {
            if (netinfo.addEventListener(state => {
                return state.isConnected == true
            })) {
                Notifications.setNotificationHandler({
                    handleNotification: async () => ({
                        shouldShowAlert: true,
                        shouldPlaySound: true,
                        shouldSetBadge: false
                    })
                })
                const db = fb.database()
                const storage = fb.storage()
                await db.ref(`/inspecoes/${inspecaoId}`).set(JSON.parse(String(Inspecao)))
                const fts: string | null = await AsyncStorage.getItem('@mais-parceria-app-fotos')
                const arrayDeFts = JSON.parse(String(fts))
                const promises = arrayDeFts.map(async (item: string, index: number) => {
                    const response = await fetch(item)
                    var blob = await response.blob()
                    await storage.ref().child(`/fotos-de-inspecao/${inspecaoId}/${index}.jpg`).put(blob)
                    var hiperlink = await storage.ref(`/fotos-de-inspecao/${inspecaoId}/${index}.jpg`).getDownloadURL()
                    await db.ref(`/fotos-de-inspecao/${(inspecaoId || 0) + index}`).set({
                        hiperlink,
                        descricao: '',
                        inspecaoId,
                        id: (inspecaoId || 0) + index,
                        respostaId
                    })
                })
                await Promise.all(promises)
                fts ? await AsyncStorage.removeItem('@mais-parceria-app-fotos', () => console.log(`Fotos apagadas`)) : console.log('não existe fotos para apagar')
            } else {
                // guardar estados até ficar online de novo
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <InspecaoContext.Provider
            value={{
                id,
                NumeroDeInspecao,
                DataEHoraDaInspecao,
                OT_OS_SI,
                MunicipioId,
                Localidade,
                CoordenadaX,
                CoordenadaY,
                Inspetor,
                Placa,
                EquipeId,
                ContratoId,
                ProcessoId,
                setProcessoContratoIdContextData,
                setInspecaoIdContextData,
                inspecaoId,
                setNewInspecao,
                Inspecao,
                setFotosInspecao,
                finishInspecao,
                setEquipeIdContext
            }}>
            {children}
        </InspecaoContext.Provider>
    )
}