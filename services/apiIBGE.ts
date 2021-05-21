import axios, { AxiosResponse } from 'axios'
import fs from 'fs/promises'

export async function getMunicipios(): Promise<void> {
    try {
        const arrayDeMunicipios: AxiosResponse = await axios.get<object[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/municipios`)
        await fs.writeFile('../municipios.json', JSON.stringify(arrayDeMunicipios.data))
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