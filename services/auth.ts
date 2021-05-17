import authentication from './authentication'
import {AxiosResponse} from 'axios'
interface Response {
    token: string,
    user: {
        name: string,
        email: string
    }
}

export async function signIn(cpf: string, senha: string): Promise<Response | null | undefined> {
    try {
        const data: AxiosResponse = await authentication.post('/login', { cpf, senha })
        return {
            token: data.data?.token,
            user: {
                name: data.data?.nome,
                email: data.data?.email
            }
        } 
    } catch (error) {
        if(error.response?.status == 500) {
            console.log(`Erro interno no sistema... ${error}`)
            return null
        } else {
            console.log(`Erro, verificar se suas entradas estão corretas. Ou ${error}`)
        }
    }
}