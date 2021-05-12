interface Response {
    token: string,
    user: {
        name: string,
        email: string
    }
}

export function signIn(): Promise<Response> {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                token: 'jkhfasufhvhjarvuioahivorhajnefiuhviluSNEFUIHepifjESÇF',
                user: {
                    name: "Vinicius",
                    email: "viniciusmouraaragao@hotmail.com"
                }
            }); 
        }, 2000)
    })
}