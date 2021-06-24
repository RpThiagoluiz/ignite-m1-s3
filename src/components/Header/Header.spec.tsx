import { render, screen } from "@testing-library/react";
import { Header } from ".";

//Vou manter por que o activeLink esta dentro desse header, entao precisamos ter acesso as rotas.
jest.mock("next/router", () => {
  return {
    useRouter() {
      return {
        asPath: "/",
      };
    },
  };
});

//Erro deu por conta do button, que ta utilizando o useSession dentro de next. Ele nao indentificou ele, msm esquema de mock. Lembra que o return do mock é ficticio. Somente para auxilar nos test. Se vc clicar no useSession, vc vai ver q ele retornara, null | false, para saber se o usuario esta logado e/ou tentando logar.
//Sempre q o component depende de algo externo, sempre busque fazer o mock para ele nao da um error.

jest.mock("next-auth/client", () => {
  return {
    useSession() {
      return [null, false];
    },
  };
});

describe("Header Component", () => {
  it("renders correctly", () => {
    const { getByText } = render(<Header />);

    // -> logo depois de da o render, ele traz uma url de test, vc consegue abrir ele no browser. vc consegue ver como se fosse um debug, com opcoes ainda, ele ajuda como vc deve escrever para pegar o bottao, ou alguma coisa do tipo. da ate sugestao de query,
    screen.logTestingPlaygroundURL();

    //So olhar o component que vc vai ver que dentro dele, tem essas duas rotas.
    expect(getByText("Home")).toBeInTheDocument();
    expect(getByText("Posts")).toBeInTheDocument();
  });
});
