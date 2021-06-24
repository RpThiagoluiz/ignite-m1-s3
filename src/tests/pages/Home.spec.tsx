import { render, screen } from "@testing-library/react";
import { mocked } from "ts-jest/utils";
import { stripe } from "../../services/stripe";
import Home, { getStaticProps } from "../../pages";
//Paginas home precisa utilizar algumas servicos, testando somente a home, porq ja testamos o subscribe button,temos poucos test. E aq temos staticprops, podemos testar isso tbm.

jest.mock("next/router");
jest.mock("next-auth/client", () => {
  return { useSession: () => [null, false] };
});
jest.mock("../../services/stripe");

describe("Home Page", () => {
  it("renders correctly", () => {
    //minha home, ela recebe um producto, com id e amount
    render(
      <Home product={{ priceId: "fake-price-id", amount: "fake-amount" }} />
    );

    //fake-amount, ele ta dentro da span, pra isso utilizamos uma expressao regular.
    expect(screen.getByText(/fake-amount/i)).toBeInTheDocument();
  });

  it("loads initial data", async () => {
    const retrieveStripePricesMocked = mocked(stripe.prices.retrieve);
    //Isso aqui uma promise, basta ver a home pra intender.
    //Msm estilo da outra, ele retornar muit coisa mas precisamos apenas de uma
    retrieveStripePricesMocked.mockResolvedValueOnce({
      id: "fake-price-id",
      unit_amount: 1000,
    } as any);

    const response = await getStaticProps({});
    //Console.log(response)
    //validar quando espero que a response tenha um obj com value e props, se tivesse passando somente o `toEqual` se ta tudo igual, `expect.objectContaining` vai ver se tem isso la dentro, na necessaria tudo.
    expect(response).toEqual(
      expect.objectContaining({
        props: { product: { amount: "$10.00", priceId: "fake-price-id" } },
      })
    );
  });
});
