import React, { createContext, useState } from 'react'
import AsyncStorage from "@react-native-async-storage/async-storage";
import netinfo from '@react-native-community/netinfo'
import fb from '../services/firebase'

interface fotoDeInspecaoProps {
    id: number | undefined,
    hiperlink: string | undefined,
    descricao: string | undefined,
    inspecaoId: number | undefined,
    respostaId?: number | undefined,
    colaboradorId: number | undefined,
    prazoDeResolucao: string | undefined
}

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
    setListaDeRespostaContext(obj: objetoDeResposta): void
    setInspecaoIdContextData(inspecaoId: number): void
    setNewInspecao(inspecao: string): Promise<void>
    setFotosInspecao(FotoURI: string): Promise<void>
    setEquipeIdContext(equipeId: number[] | undefined): void
    finishInspecao(): Promise<void>
    setDescricaoContext(desc: string): void
    setColabIdContext(colabId: number): void
    setRespId(id: number): void
    setDates(date: string): void
}

interface objetoDeResposta {
    respostaId: number
    inspecaoId: number | undefined
    perguntaId: number
    valorResposta: string
    status?: string
    indiceDaFoto?: number
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
    const [arrNaoConformidadesIds, setArrNaoConformidadesIds] = useState<number[]>([])
    const [arrDeRespostas, setArrDeRespostas] = useState<objetoDeResposta[]>([])
    const [fotos, setFotos] = useState<string[]>([])

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

    async function setFotosInspecao(FotoURI: string) {
        const arrDeFotos = fotos
        arrDeFotos?.push(FotoURI)
        setFotos(arrDeFotos)
        await AsyncStorage.setItem('@mais-parceria-app-fotos', JSON.stringify(fotos))
    }

    function setEquipeIdContext(equipeId: number[]) {
        setEquipeId(equipeId)
    }

    function setColabIdContext(colabIdLocal: number) {
        const arrColabId = colabId
        arrColabId?.push(colabIdLocal ? colabIdLocal : 0)
        setColabId(arrColabId)
        console.log(`array de colaboradores attribuidos a nao conformidades: ${colabId}`)
    }

    function setDescricaoContext(desc: string) {
        const arrDeDesc = descricao
        arrDeDesc.push(desc)
        setDescricao(arrDeDesc)
    }

    function setRespId(id: number) {
        const arrNaoConformidade = arrNaoConformidadesIds
        setRespostaId(id)
        arrNaoConformidade.push(id)
        setArrNaoConformidadesIds(arrNaoConformidade)
    }

    function setDates(dates: string) {
        const arrDeDates = prazoDasNaoConformidades
        arrDeDates.push(dates)
        setPrazoDasNaoConformidades(arrDeDates)
    }

    function setListaDeRespostaContext(obj: objetoDeResposta) {
        const arr: objetoDeResposta[] = arrDeRespostas
        const indexEncontrado = arrDeRespostas.findIndex(resposta => {
            return resposta.perguntaId === obj.perguntaId
        })
        if (indexEncontrado != -1) {
            arr[indexEncontrado] = obj
        } else {
            arr.push(obj)
        }
        setArrDeRespostas(arr)
    }
    async function upload() {
        try {
            const db = fb.database()
            const storage = fb.storage()
            var snap = await db.ref('/controle/numero-de-inspecao').once('value')
            var shot = snap.exportVal()
            await db.ref(`/inspecoes/${inspecaoId}`).set(JSON.parse(String(Inspecao)))
            await db.ref('/controle/numero-de-inspecao').set(Number(shot) + 1)
            await db.ref(`/respostas/${inspecaoId}`).set(arrDeRespostas)
            const fts: string = String(await AsyncStorage.getItem('@mais-parceria-app-fotos'))
            const arrayDeFotos: any[] = JSON.parse(fts || "")
            if (arrayDeFotos?.length > 0) {
                const promises = arrayDeFotos?.map(async (item: string, index: number) => {
                    const response = await fetch(item)
                    var blob = await response.blob();
                    await storage.ref().child(`/fotos-de-inspecao/${inspecaoId}/${index}.jpg`).put(blob)
                    var hiperlink = await storage.ref(`/fotos-de-inspecao/${inspecaoId}/${index}.jpg`).getDownloadURL()
                    var fotosDeInspecoes: fotoDeInspecaoProps = {
                        id: new Date().getTime() || 0 + index,
                        hiperlink,
                        descricao: descricao[index] || "",
                        inspecaoId,
                        colaboradorId: colabId[index] !== 0 ? colabId[index] : 0,
                        prazoDeResolucao: prazoDasNaoConformidades[index] || "",
                        respostaId: arrDeRespostas[index].respostaId
                    }
                    await db.ref(`/fotos-de-inspecao/${fotosDeInspecoes.id}`).set(fotosDeInspecoes)
                    await Promise.all(promises).then(() => alert('Foto(s) enviada(s) com sucesso!'))
                })
            }
            setColabId([])
            setPrazoDasNaoConformidades([])
            setDescricao([])
            setArrDeRespostas([])
            fts ? await AsyncStorage.removeItem('@mais-parceria-app-fotos', () => alert(`Inspeção enviada com sucesso`)) : console.log('não existe fotos para apagar')
        } catch (error) {
            console.log(error)
        }
    }

    async function finishInspecao() {
        // esta função vai escrever tudo no banco de dados.
        netinfo.fetch().then(async state => {
            if (state.isConnected == true) {
                upload()
            } else {
                netinfo.addEventListener(async state => {
                    if (state.isConnected == true) {
                        upload()
                    }
                })
            }
        })
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
                setDates,
                setListaDeRespostaContext
            }}>
            {children}
        </InspecaoContext.Provider>
    )
}