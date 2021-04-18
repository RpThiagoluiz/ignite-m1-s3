import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream"; //valor da req
import Stripe from "stripe";
import { stripe } from "../../services/stripe";
import { saveSubscription } from "./_lib/manageSubscription";

async function buffer(readable: Readable) {
  const chunks = [];

  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks);
}

//Config por padrao o next recebe um json, eu tenho que desabilitar o entendimento padrao do next
//da req, uma vez q ela sera um string
export const config = {
  api: {
    bodyParser: false,
  },
};

//Quais eventos eu quero ouvir
const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscriptions.updated",
  "customer.subscriptions.deleted",
]);

//Comum que quando uma app terceira, ela envia um codigo
//Esse codigo é verificado para nao permitir que outro enviem badReq, nao autorizados.
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const buf = await buffer(req); //os dados da request, header, body

    //procurnado dentro do meu header, essa assitura no stripe
    //verificar se ela bate com a gerada por min
    const secret = req.headers["stripe-signature"];

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        buf,
        secret,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (error) {
      return res.status(400).send(`Webhook error: ${error.message}`);
    }

    const { type } = event;

    if (relevantEvents.has(type)) {
      try {
        switch (type) {
          case "customer.subscriptions.updated":
          case "customer.subscriptions.deleted":
            const subscription = event.data.object as Stripe.Subscription;

            await saveSubscription(
              subscription.id,
              subscription.customer.toString(),
              false
            );

            break;
          case "checkout.session.completed":
            const checkoutSession = event.data
              .object as Stripe.Checkout.Session;

            await saveSubscription(
              checkoutSession.subscription.toString(),
              checkoutSession.customer.toString(),
              true
            );
            break;

          default:
            throw new Error("Unhandled event.");
        }
      } catch (error) {
        //retornando pro stripe
        //avisando o stripe q nao deu certo
        return res.json({ error: "Webhook handler failed!" });
      }
    }

    res.status(200).json({ ok: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method not allowed");
  }
};
