import React, { createContext, useState } from 'react'

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
    Equipe: string | undefined,
    ContratoId: number | undefined,
    ProcessoId: number | undefined,
    inspecaoId: number | undefined,
    setProcessoContratoIdContextData(IdProcesso: number, idContrato: number): void,
    setInspecaoIdContextData(inspecaoId: number):void
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
    const [Equipe, setEquipe] = useState<string>()
    const [ContratoId, setContratoId] = useState<number>()
    const [ProcessoId, setProcessoId] = useState<number>()
    const [inspecaoId, setInspecaoId] = useState<number>()

    function setProcessoContratoIdContextData(processoId: number, contratoId: number) {
        setProcessoId(processoId)
        setContratoId(contratoId)
    }
    function setInspecaoIdContextData(inspecaoId: number) {
        setInspecaoId(inspecaoId)
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
                Equipe,
                ContratoId,
                ProcessoId,
                setProcessoContratoIdContextData,
                setInspecaoIdContextData,
                inspecaoId
            }}>
            { children }
        </InspecaoContext.Provider>
    )
}