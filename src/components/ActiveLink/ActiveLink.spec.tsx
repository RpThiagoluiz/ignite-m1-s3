import {render, screen} from "@testing-library/react"
import React from "react"
import { ActiveLink } from "."

//render -> renderizar de forma virtual o component
// ou screen -> vou deixar dos 2 jeitos para nivel de comparacao de codigo.
//ActiveLink -> nosso component, e ele recebe algumas porps, vc tem passar elas para nao da error.

//Nosso component Test, 


// test -> recebe um nome, e um funcao do que ele vai fazer. 
//debug dentro do render, 
//Priemiro erro que esse component precisa de algo externo, algo do next, o useRouter no caso do component active link, para isso precisamos criar um motch, para imitiar a parte de roteamento do next.


jest.mock('next/router', () => {
  return {
    useRouter(){
      return {
        //aqui vc passand o a '/' como Path, no caso o root de todo, a home.
        asPath:'/'
      }
    }
  }
})
//jest, imitiar o comportamento do import que for externo, no caso o next/router.


// Test, executar uma acao, e oque eu espero do test.
// no nossa caso que o home esteja em tela.

// const {debug} = render() ela tras a dom que vai ser renderizar
// getByText -> que ele procurar um elemento que tenha esses dados

//describe, ele vai dizer oq esta sendo testando nessa conjunto de tests Unitarios
describe('ActiveLink component', () => {
  //it pode ser substituido por test, ou vice-versa
  it('renders correctly' , () => {
    render(
      <ActiveLink href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>
    )
    //Espero que dentro do documento, ele contenha um texto escrito Home
    expect(screen.getByText('Home')).toBeInTheDocument()
  })
  
  it(' receiving active class' , () => {
    const {getByText} = render(
      <ActiveLink href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>
    )
    //Espero que dentro do documento, ele contenha uma classe, e que essa classe seja active, caso eu mude o href, ele nao vai retornar como active, por causa do patch do useRouter. la em cima
    expect(getByText('Home')).toHaveClass('active')
  })
  
})
