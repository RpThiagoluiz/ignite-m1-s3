import {render} from "@testing-library/react"
import {Header} from '.'

//Vou manter por que o activeLink esta dentro desse header, entao precisamos ter acesso as rotas.
jest.mock('next/router',() => {
  return {
    useRouter(){
      return{
        asPath:'/'
      }
    }
  }
})


//Erro deu por conta do button, que ta utilizando o useSession dentro de next. Ele nao indentificou ele, msm esquema de mock. Lembra que o return do mock é ficticio. Somente para auxilar nos test. Se vc clicar no useSession, vc vai ver q ele retornara, null | false, para saber se o usuario esta logado e/ou tentando logar.
//Sempre q o component depende de algo externo, sempre busque fazer o mock para ele nao da um error.

jest.mock('next-auth/client',() => {
  return {
    useSession() {
      return [null, false]
    }
  }
})


describe('Header Component', () => {
  it('renders correctly', () => {
    const {getByText} = render(
      <Header/>
    )

    //So olhar o component que vc vai ver que dentro dele, tem essas duas rotas.
    expect(getByText('Home')).toBeInTheDocument()
    expect(getByText('Posts')).toBeInTheDocument()
  })
})