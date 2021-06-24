import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { Async } from ".";

//pode encontar elementos por diversos tipos
// -> getByLabelText, getByPlaceHolderText

describe("Async testing for other aways", () => {
  it("it renders correctly,", async () => {
    render(<Async />);

    expect(screen.getByText("Hello World!")).toBeInTheDocument();
    //Jest nao vai esperar o tempo da chamada para o button aparecer.
    //Se vc limpar o time out, vai da error, porq ele espera. Colocando na fila, se a fila for limpa, ele nao vai pegar o button.
    expect(await screen.findByText("ButtonAsync")).toBeInTheDocument();
  });

  it("it will be render in waitFor method", async () => {
    render(<Async />);

    //waitFor, recebe um segundo parametro, tbm, olhar a doc do

    await waitFor(() => {
      //dando looping ate que ele passe
      return expect(screen.getByText("ButtonAsync")).toBeInTheDocument();
    });
  });

  it("it will be render in waitFor method - when HAVEN`T element", async () => {
    render(<Async />);

    //Agora eu quero aguardar para o bottao nao estar no documento.
    //await waitForElementToBeRemoved(screen.queryByText("InvisibleButton"));

    //!important aqui tem que ser o queryByText,
    //getByText -> get - vao dar error caso nao encontre
    //queryByText -> todos que comecam com query, ele vai procurar de forma sincrona mas ele nao da error
    //find -> procura de forma async

    await waitFor(() => {
      return expect(
        screen.queryByText("InvisibleButton")
      ).not.toBeInTheDocument();
    });
  });
});
