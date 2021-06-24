import {render, screen, fireEvent} from "@testing-library/react"
import {mocked} from "ts-jest/utils"
import {signIn, useSession} from "next-auth/client"
import {useRouter} from "next/router"
import {SubscribeButton} from '.'
//Mais complexo, caso o usario esteja logado tem comportamentos diferentes.

jest.mock('next-auth/client')
jest.mock('next/router')


describe('SubscribeButton Component', () => {
  it('renders correctly', () => {
    const useSessionMocked = mocked(useSession)
    useSessionMocked.mockReturnValueOnce([null, false])
    render(<SubscribeButton/>)
    expect(screen.getByText('Subscribe now')).toBeInTheDocument()
  })

  it('redirects user to sing in when not authenticated', () => {
    //Nesse test eu preciso disparar um evento de click. Para isso temos o fireEvent.
    //Vamos render no component, pegar ele salvar em uma variavel e disparar o evento de clique, lembrando que estamos pegando ele pego texto.
    //O que esperamos que aconteca - no caso se a funcao singIn foi chamada, que vem no nextAuth Client
    const useSessionMocked = mocked(useSession)
    useSessionMocked.mockReturnValueOnce([null, false])
    const singInMocked = mocked(signIn)
    render(<SubscribeButton/>)
    const subscribeButton = screen.getByText('Subscribe now')
    fireEvent.click(subscribeButton)
    
    expect(singInMocked).toHaveBeenCalled()

  })

  it('redirects to posts when user already has a subscription', () => {
    //aq tbm preciso das rotas - porq existe um redirect.
    const useRouterMocked = mocked(useRouter)
    const useSessionMocked = mocked(useSession)
    const pushMocked = jest.fn()
  

    //da um erro, porq o useRouter tem varios metodos dentro dele, contudo eu so quero o push, ele é a unica coisa que utilizamos no render da component.
    //para garantir, extraimos o valor dela, e criar uma variavel foda do useRouterMocked para termos acesso a ela, lembra que preciso que usario esteja logado pra redirecionar ele.

    useSessionMocked.mockReturnValueOnce([{user: {name: 'Jhon Doe', email: 'jhon.doe@example.com'}, activeSubscription:"fake-active-subscription",expires :'fake-expires'}, false])


    useRouterMocked.mockReturnValueOnce({
      push: pushMocked
    }as any)





    render(<SubscribeButton/>)
    const subscribeButton = screen.getByText('Subscribe now')
    fireEvent.click(subscribeButton)
//foi chamado na rota posts.
    expect(pushMocked).toHaveBeenCalledWith('/posts')
    
  })
})