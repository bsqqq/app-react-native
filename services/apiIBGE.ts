import axios, { AxiosResponse } from 'axios'
import * as fs from 'expo-file-system'

export async function getMunicipios(): Promise<void> {
    const path = fs.documentDirectory + 'json/'
    const fileUri = (jsonId: string) => `${path}${jsonId}.json`
    try {
        const arrayDeMunicipios: AxiosResponse = await axios.get<object[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/municipios`)
        const dirInfo = await fs.getInfoAsync(path)
            if (!dirInfo.exists)
                await fs.makeDirectoryAsync(path, { intermediates: true })
        await fs.writeAsStringAsync(fileUri('municipios'), JSON.stringify(arrayDeMunicipios.data))
    } catch (error) {
        console.log(error)
    }
}

export async function searchMunicipiosById(id: number): Promise<object | undefined> {
    try {
        const municipioPesquisado: AxiosResponse = await axios.get<object>(`https://servicodados.ibge.gov.br/api/v1/localidades/municipios/${id}`)
        return municipioPesquisado.data
    } catch (error) {
        console.log(error)
    }
}

export async function loadMunicipios() {

}