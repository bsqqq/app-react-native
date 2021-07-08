import Constants from 'expo-constants'
import axios, { AxiosResponse, AxiosInstance } from 'axios'

const authentication: AxiosInstance = axios.create({
    baseURL: Constants.manifest.extra?.REACT_APP_API_URL
})

export default authentication
export interface Response {
    token: string,
    user: {
        name: string,
        email: string
    }
}

export async function signIn(cpf: string, senha: string): Promise<Response | null | undefined> {
    try {
        const response: AxiosResponse = await authentication.post('/login', { cpf, senha })
        return {
            token: response.data?.token,
            user: {
                name: response.data?.nome,
                email: response.data?.email
            }
        }
    } catch (error) {
        if (error.response?.status == 500) {
            console.log(`Erro interno no sistema... ${error}`)
            alert("Algo deu errado, erro interno no sistema!")
            return null
        } else {
            alert("Algo deu errado, por favor verifique seu CPF e senha e tente novamente")
            console.log(`Erro, verificar se suas entradas estão corretas. Ou ${error}`)
            return null
        }
    }
}