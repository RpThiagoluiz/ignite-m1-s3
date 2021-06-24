import { GetStaticProps } from "next";
import Head from "next/head";
import styles from "../styles/home.module.scss";
import { SubscribeButton } from "../components/SubscribeButton";
import { stripe } from "../services/stripe";

// const formatPrice = (number) =>
//   new Intl.NumberFormat("pt-BR", {
//     style: "currency",
//     currency: "BRL",
//   }).format(number);

interface HomeProps {
  product: {
    priceId: string;
    amount: string;
  };
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>My page</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>🐱‍🏍 Hey, welcome</span>
          <h1>
            News about <br /> the <span>React</span> world.
          </h1>
          <p>
            Get acess to all the publications <br />
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton />
        </section>

        <img src="/images/avatar.svg" alt="Girl coding" />
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve("price_1IZbv1CLAp5OnGzSQ1cI6IAz", {
    // expand: ["product"], -> pegar as info do produto, como nome ...
  });

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price.unit_amount / 100),
  };

  return {
    props: {
      product,
    },
    revalidate: 3600 * 24, // 24 hours
  };
};

// //import {GetServerSideProps} from "next"
// export const getServerSide: GetServerSideProps = async () => {
//   const price = await stripe.prices.retrieve("price_1IZbv1CLAp5OnGzSQ1cI6IAz", {
//     // expand: ["product"], -> pegar as info do produto, como nome ...
//   });

//   const product = {
//     priceId: price.id,
//     amount: new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: "USD",
//     }).format(price.unit_amount / 100),
//   };

//   return {
//     props: {
//       product,
//     }
//   };
// };
