import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from "faunadb";
import { getSession } from "next-auth/client";
import { fauna } from "../../services/fauna";
import { stripe } from "../../services/stripe";

type User = {
  ref: {
    id: string;
  };
  data: {
    stripe_customer_id: string;
  };
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  //criando uma checkout post no meu stripe.
  if (req.method === "POST") {
    //criar o customer que vai ser cadastrado no stripe,
    //pegar do banco de dados e colocar no stripe
    //cookies estao salvando os dados do usario vmo pegar por la
    //LocalStorage so salva no front, ja os cookies se tiver no msm dominio o back end tbm tem acesso.

    const session = await getSession({ req });

    const user = await fauna.query<User>(
      q.Get(q.Match(q.Index("user_by_email"), q.Casefold(session.user.email)))
    );

    let customerId = user.data.stripe_customer_id;

    if (!customerId) {
      //Se ele nao existir ela cria um novo customer
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email,
        //metadata
      });
      //salva no banco
      await fauna.query(
        q.Update(q.Ref(q.Collection("users"), user.ref.id), {
          data: { stripe_customer_id: stripeCustomer.id },
        })
      );

      customerId = stripeCustomer.id;
    }

    const stripeCheckoutSesssion = await stripe.checkout.sessions.create({
      customer: customerId, //id do customer no stripe nao no banco de dados.
      payment_method_types: ["card"],
      billing_address_collection: "required",
      line_items: [
        {
          price: "price_1IZbv1CLAp5OnGzSQ1cI6IAz",
          quantity: 1,
        },
      ],
      mode: "subscription",
      allow_promotion_codes: true,
      //success_url:'http://localhost:3000/posts',
      //Colocar de forma estatica aqui coloca em variaveis ambiente
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
    });

    return res.status(200).json({ sessionId: stripeCheckoutSesssion.id });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method not allowed");
  }
};
