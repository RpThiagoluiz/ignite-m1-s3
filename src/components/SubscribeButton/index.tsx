import { useSession, signIn } from "next-auth/client";
import { api } from "../../services/api";
import { getStripeJs } from "../../services/stripe-js";
import styles from "./styles.module.scss";

interface SubscribeButtonProps {
  priceId: string;
}

//As credenciais secretas que nao podem vir a publico podem ser utilizadas em
//getServerSideProps(SSR) - so sao utilizados quando a pagina ta rendeziada
//getStaticProps(SSG) - so sao utilizados quando a pagina ta rendeziada
//API routes - on click melhor caso
//Criado la na minhas rotas o metodo para cadastras o usuario no stripe, e a requisicao que o stripe pede.
//subscribe

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const [session] = useSession();

  async function handleSubscribe() {
    if (!session) {
      signIn("github");
      return;
    }

    try {
      const response = await api.post("/subscribe");
      const { sessionId } = response.data;
      const stripe = await getStripeJs();
      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.log(error);
    }

    //criacao da checkout section
    //stripe checkout section. na propria doc dele
  }

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
}
