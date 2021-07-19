import React, { createContext, useState } from 'react'
import AsyncStorage from "@react-native-async-storage/async-storage";
import netinfo from '@react-native-community/netinfo'
import fb from '../services/firebase'
import * as fs from 'expo-file-system'

export interface InspecaoContextData {
    id?: number | undefined
    NumeroDeInspecao: number | undefined
    DataEHoraDaInspecao: string | undefined
    OT_OS_SI: number | undefined
    MunicipioId: string | number | undefined
    Localidade: string | undefined
    CoordenadaX: string | number | undefined
    CoordenadaY: string | number | undefined
    Inspetor: string | undefined
    Placa: string | undefined
    EquipeId: number[] | undefined
    ContratoId: number | undefined
    ProcessoId: number | undefined
    inspecaoId: number | undefined
    Inspecao: string | undefined
    descricao: string[] | undefined
    colabId: number[] | undefined
    respostaId: number | undefined
    setProcessoContratoIdContextData(IdProcesso: number, idContrato: number): void
    setInspecaoIdContextData(inspecaoId: number): void
    setNewInspecao(inspecao: string): Promise<void>
    setFotosInspecao(FotoURI: string[]): Promise<void>
    setEquipeIdContext(equipeId: number[] | undefined): void
    finishInspecao(): Promise<void>
    setDescricaoContext(desc: string): void
    setColabIdContext(colabId: number): void
    setRespId(id: number): void
    setDates(date: string): void
}

const InspecaoContext = createContext<InspecaoContextData>({} as InspecaoContextData)
export default InspecaoContext

export const InspecaoProvider: React.FC = ({ children }) => {
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
    const [descricao, setDescricao] = useState<string[]>([])
    const [respostaId, setRespostaId] = useState<number>()
    const [colabId, setColabId] = useState<number[]>([])
    const [prazoDasNaoConformidades, setPrazoDasNaoConformidades] = useState<string[]>([])
    const [arrNaoConformmidadesIds, setArrNaoConformidadesIds] = useState<number[]>([])

    function setProcessoContratoIdContextData(processoId: number, contratoId: number) {
        setProcessoId(processoId)
        setContratoId(contratoId)
    }

    function setInspecaoIdContextData(inspecaoId: number) {
        setInspecaoId(inspecaoId)
    }

    async function setNewInspecao(inspecao: string) {
        setInspecao(inspecao)
        await AsyncStorage.setItem('@mais-parceria-app-inspecao', inspecao)
    }

    async function setFotosInspecao(FotoURI: string[]) {
        await AsyncStorage.setItem('@mais-parceria-app-fotos', JSON.stringify(FotoURI))
    }

    function setEquipeIdContext(equipeId: number[]) {
        setEquipeId(equipeId)
    }

    function setColabIdContext(colabIdLocal: number) {
        const arrColabId = colabId
        arrColabId?.push(colabIdLocal)
        setColabId(arrColabId)
    }

    function setDescricaoContext(desc: string) {
        const arrDeDesc = descricao
        arrDeDesc.push(desc)
        setDescricao(arrDeDesc)
    }

    function setRespId(id: number) {
        const arrNaoConformidade = arrNaoConformmidadesIds
        setRespostaId(id)
        arrNaoConformidade.push(id)
        setArrNaoConformidadesIds(arrNaoConformidade)
    }

    function setDates(dates: string) {
        const arrDeDates = prazoDasNaoConformidades
        arrDeDates.push(dates)
        setPrazoDasNaoConformidades(arrDeDates)
    }

    async function finishInspecao() {
        // esta função vai escrever tudo no banco de dados.
        const db = fb.database()
        const storage = fb.storage()
        var path = fs.documentDirectory + 'json/'
        const fileUri = (jsonId: string) => path + `${jsonId}.json`
        var snap = await db.ref('/controle/numero-de-inspecao').once('value')
        var shot = snap.exportVal()
        try {
            netinfo.fetch().then(async state => {
                if (state.isConnected == true) {
                    await db.ref(`/inspecoes/${inspecaoId}`).set(JSON.parse(String(Inspecao)))
                    await db.ref('/controle/numero-de-inspecao').set(await fs.readAsStringAsync(fileUri('numero-de-inspecao')) + 1 || shot + 1)
                    const fts: string | null = await AsyncStorage.getItem('@mais-parceria-app-fotos')
                    const arrayDeFts = JSON.parse(String(fts))
                    const promises = arrayDeFts.map(async (item: string, index: number) => {
                        const response = await fetch(item)
                        var blob = await response.blob()
                        await storage.ref().child(`/fotos-de-inspecao/${inspecaoId}/${index}.jpg`).put(blob)
                        var hiperlink = await storage.ref(`/fotos-de-inspecao/${inspecaoId}/${index}.jpg`).getDownloadURL()
                        await db.ref(`/fotos-de-inspecao/${(inspecaoId || 0) + index}`).set({
                            id: (inspecaoId || 0) + index,
                            hiperlink,
                            descricao: descricao[index] || "",
                            inspecaoId,
                            respostaId,
                            colaboradorId: colabId[index] !== 0 ? colabId[index] : 0,
                            prazoDeReolucao: prazoDasNaoConformidades[index] || ""
                        })
                    })
                    await Promise.all(promises).then(() => alert('Inspeção enviada com sucesso!'))
                    fts ? await AsyncStorage.removeItem('@mais-parceria-app-fotos', () => console.log(`Fotos apagadas`)) : console.log('não existe fotos para apagar')
                } else {
                    alert('AVISO: Atualmente o dispositivo se encontra offline, se caso não for possível enviar as inspeções normalmente para o servidor até o primeiro momento que se encontrar online, tente contactar todos os envolvidos sobre qualquer Não Conformidade, prazo, responsável, etc... as fotos são salvas automaticamente no álbum do dispositivo. Informe também ao desenvolvedor (Vinicius) sobre o caso para uma solução em breve...')
                    netinfo.addEventListener(async state => {
                        if (state.isConnected == true) {
                            await db.ref(`/inspecoes/${inspecaoId}`).set(JSON.parse(String(Inspecao)))
                            const fts: string | null = await AsyncStorage.getItem('@mais-parceria-app-fotos')
                            const arrayDeFts = JSON.parse(String(fts))
                            const promises = arrayDeFts.map(async (item: string, index: number) => {
                                const response = await fetch(item)
                                var blob = await response.blob()
                                await storage.ref().child(`/fotos-de-inspecao/${inspecaoId}/${index}.jpg`).put(blob)
                                var hiperlink = await storage.ref(`/fotos-de-inspecao/${inspecaoId}/${index}.jpg`).getDownloadURL()
                                await db.ref(`/fotos-de-inspecao/${(inspecaoId || 0) + index}`).set({
                                    id: (inspecaoId || 0) + index,
                                    hiperlink,
                                    descricao: descricao[index] || "",
                                    inspecaoId,
                                    respostaId,
                                    colaboradorId: colabId[index] !== 0 ? colabId[index] : 0,
                                    prazoDeReolucao: prazoDasNaoConformidades[index] || ""
                                })
                            })
                            await Promise.all(promises).then(() => alert('Inspeção enviada com sucesso!'))
                            fts ? await AsyncStorage.removeItem('@mais-parceria-app-fotos', () => console.log(`Fotos apagadas`)) : console.log('não existe fotos para apagar')
                        }
                    })
                }
            })
        } catch (error) {
            alert(error)
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
                descricao,
                ContratoId,
                ProcessoId,
                setProcessoContratoIdContextData,
                setInspecaoIdContextData,
                inspecaoId,
                setNewInspecao,
                Inspecao,
                setFotosInspecao,
                finishInspecao,
                setEquipeIdContext,
                setDescricaoContext,
                setColabIdContext,
                colabId,
                setRespId,
                respostaId,
                setDates
            }}>
            {children}
        </InspecaoContext.Provider>
    )
}