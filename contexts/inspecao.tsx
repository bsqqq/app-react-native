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
    Inspetor: string | null
}

const InspecaoContext = createContext<InspecaoContextData>({} as InspecaoContextData)
export default InspecaoContext

const [id, setId] = useState<number>(0)
const [NumeroDeInspecao, setNumeroDeInspecao] = useState<number>(0)
const [DataEHoraDaInspecao, setDataEHoraDaInspecao] = useState<string>("")
const [OT_OS_SI, setOT_OS_SI] = useState<number>(0)
const [MunicipioId, setMunicipio] = useState<number>(0)
const [Localidade, setLocalidade] = useState<string>("")
const [CoordenadaX, setCoordenadaX] = useState("")
const [CoordenadaY, setCoordenadaY] = useState("")
const [Inspetor, setInspetor] = useState("")

export const InspecaoProvider: React.FC = ({ children }) => {
    return (
        <InspecaoContext.Provider value={{id, NumeroDeInspecao, DataEHoraDaInspecao, OT_OS_SI, MunicipioId, Localidade, CoordenadaX, CoordenadaY, Inspetor}}>
            { children }
        </InspecaoContext.Provider>
    )
}