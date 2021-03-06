import React, { createContext, useState, useContext } from 'react'
import AsyncStorage from "@react-native-async-storage/async-storage";
import netinfo from '@react-native-community/netinfo'
import fb from '../services/firebase'
import ChecklistContext from './checklist';

type fotoDeInspecaoProps = {
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
    checklist: boolean | undefined
    setChecklistContext(isChecklist: boolean): void
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

type objetoDeResposta = {
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
    const [descricao, setDescricao] = useState<Array<string>>([])
    const [respostaId, setRespostaId] = useState<number>()
    const [colabId, setColabId] = useState<number[]>([])
    const [prazoDasNaoConformidades, setPrazoDasNaoConformidades] = useState<string[]>([])
    const [arrNaoConformidadesIds, setArrNaoConformidadesIds] = useState<number[]>([])
    const [arrDeRespostas, setArrDeRespostas] = useState<objetoDeResposta[]>([])
    const [fotos, setFotos] = useState<string[]>([])
    const [checklist, setChecklist] = useState<boolean>(false)
    const { checklistData } = useContext(ChecklistContext)

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
        arrDeFotos.push(FotoURI)
        setFotos(arrDeFotos)
        console.log(`quantidade de fotos a serem enviadas: ${fotos.length}`)
        console.log(`quantidade de respostas para ser enviadas: ${arrDeRespostas.length}`)
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

    function setChecklistContext(isChecklist: boolean) {
        setChecklist(isChecklist)
    }

    async function upload() {
        if (checklist == true) {
            // envio de checklist
            try {
                console.log('enviando a checklist e suas respostas...')
                const db = fb.database()
                const storage = fb.storage()
                await db.ref(`/checklist/${checklistData?.id}`).set(checklistData)
                await db.ref(`/respostas/${checklistData?.id}`).set(arrDeRespostas)
                const fts: string = String(await AsyncStorage.getItem('@mais-parceria-app-fotos'))
                const arrayDeFotos: any[] = JSON.parse(fts || "")
                if (arrayDeFotos?.length > 0) {
                    const promises = arrayDeFotos?.map(async (item: string, index: number) => {
                        const response = await fetch(item);
                        var blob = await response.blob();
                        await storage.ref().child(`/fotos-de-checklist/${inspecaoId}/${index}.jpg`).put(blob);
                        var hiperlink = await storage.ref(`/fotos-de-checklist/${inspecaoId}/${index}.jpg`).getDownloadURL();
                        var fotosDeChecklist: fotoDeInspecaoProps = {
                            id: new Date().getTime(),
                            hiperlink,
                            descricao: descricao[index] || "",
                            inspecaoId,
                            colaboradorId: colabId[index] !== 0 ? colabId[index] : 0,
                            prazoDeResolucao: prazoDasNaoConformidades[index] || "",
                            respostaId: arrNaoConformidadesIds[index] ? arrNaoConformidadesIds[index] : 0
                        };
                        console.log(fotosDeChecklist.respostaId)
                        await db.ref(`/fotos-de-checklist/${fotosDeChecklist.id}`).set(fotosDeChecklist);
                        await Promise.all(promises).then(() => alert('Foto(s) enviada(s) com sucesso!'));
                    })
                }
                setColabId([])
                setPrazoDasNaoConformidades([])
                setDescricao([])
                setArrDeRespostas([])
                setFotos([])
                setArrNaoConformidadesIds([])
                fts ? await AsyncStorage.removeItem('@mais-parceria-app-fotos', () => alert(`Inspe????o enviada com sucesso`)) : console.log('n??o existe fotos para apagar')
            } catch (error) {
                console.log(error)
            }
        } else {
            // envio de inspe????o
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
                        const response = await fetch(item);
                        var blob = await response.blob();
                        await storage.ref().child(`/fotos-de-inspecao/${inspecaoId}/${index}.jpg`).put(blob);
                        var hiperlink = await storage.ref(`/fotos-de-inspecao/${inspecaoId}/${index}.jpg`).getDownloadURL();
                        var fotosDeInspecoes: fotoDeInspecaoProps = {
                            id: new Date().getTime(),
                            hiperlink,
                            descricao: descricao[index] || "",
                            inspecaoId,
                            colaboradorId: colabId[index] !== 0 ? colabId[index] : 0,
                            prazoDeResolucao: prazoDasNaoConformidades[index] || "",
                            respostaId: arrNaoConformidadesIds[index] ? arrNaoConformidadesIds[index] : 0
                        };
                        console.log(fotosDeInspecoes.respostaId)
                        await db.ref(`/fotos-de-inspecao/${fotosDeInspecoes.id}`).set(fotosDeInspecoes);
                        await Promise.all(promises).then(() => alert('Foto(s) enviada(s) com sucesso!'));
                    })
                }
                setColabId([])
                setPrazoDasNaoConformidades([])
                setDescricao([])
                setArrDeRespostas([])
                setFotos([])
                setArrNaoConformidadesIds([])
                fts ? await AsyncStorage.removeItem('@mais-parceria-app-fotos', () => alert(`Inspe????o enviada com sucesso`)) : console.log('n??o existe fotos para apagar')
            } catch (error) {
                console.log(error)
            }
        }
    }

    async function finishInspecao() {
        // esta fun????o vai escrever tudo no banco de dados.
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
                setListaDeRespostaContext,
                checklist,
                setChecklistContext
            }}>
            {children}
        </InspecaoContext.Provider>
    )
}