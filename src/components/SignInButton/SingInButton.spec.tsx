import {render, screen} from "@testing-library/react"
import {mocked} from "ts-jest/utils"
import {useSession} from 'next-auth/client'
import {SignInButton} from '.'


//!import -> sempre olha o component e veja oq ele ta fazendo pra criar o test.
//dando return sempre como nao authenticated, quero ele como authenticated
//Mudamos o jeito que lidamos com o mock
// useSession - e traz um funcionamento diferente cada chamada dela, quando o user estiver logado, e quando ele estiver off.
// Precisar instalar uma ferramenta extra, yarn add ts-jest -D

jest.mock('next-auth/client')


describe('SingInButton Component', () => {
  it('renders correctly when user is not authenticated', () => {
    const useSessionMocked = mocked(useSession)

//useSessionMocked.mockReturnValueOnce([null, false]) -> apartir dessa linha toda vez q ela funcao for chamada sera na hora que o component for renderizado, ela vai retuornar oq vc quer. O once, ele vai mocar somente o primeiro return dessa funcao
    useSessionMocked.mockReturnValueOnce([null, false])
    //vai ser valido somente para primeira render, diferente do sem o once, que vai ser sempre

    render(<SignInButton/>)
  

    expect(screen.getByText('Sign in with Github')).toBeInTheDocument()

    //Caso vc queria ver, pego debug(), const {debug} = render(....)
    
  })

  it('renders correctly when user is authenticated', () => {
    //Aqui eu ja quero o nome do usario esteja dentro do botao, vamos testar isso. Vamos passar os dados que o user precisa ter pra confirmar q ele esta logado, ts ajuda.
    const useSessionMocked = mocked(useSession)
    useSessionMocked.mockReturnValueOnce([{user: {name: 'Jhon Doe', email: 'jhon.doe@example.com'}, expires :'fake-expires'}, false])

    render(<SignInButton/>)
    

    expect(screen.getByText('Jhon Doe')).toBeInTheDocument()

    //Caso vc queria ver, pego debug(), const {debug} = render(....)
    
  })
})