import { query as q } from "faunadb";

import NextAuth from "next-auth";

import Providers from "next-auth/providers";
import { fauna } from "../../../services/fauna";

export default NextAuth({
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope: "read:user",
    }),
  ],
  // jwt: {
  //   signingKey: process.env.SINGING_KEY,
  // },
  callbacks: {
    async session(session) {
      try {
        const userActiveSubscription = await fauna.query(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index("subscription_by_user_ref"),
                q.Select(
                  "ref",
                  q.Get(
                    q.Match(
                      q.Index("user_by_email"),
                      q.Casefold(session.user.email)
                    )
                  )
                )
              ),
              q.Match(q.Index("subscription_by_status"), "active"),
            ])
          )
        );
        return {
          ...session,
          activeSubscription: userActiveSubscription,
        };
      } catch (error) {
        return {
          ...session,
          activeSubscription: null,
        };
      }
    },
    async signIn(user, acconunt, profile) {
      const { email } = user;

      //fauna query language.
      //fauna doc tem o FQL cheat sheet
      // try aqui, caso o msm usario ja tenha cadastrado ele retorne um erro.
      try {
        await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(q.Index("user_by_email"), q.Casefold(user.email))
              )
            ),
            q.Create(q.Collection("users"), { data: { email } }),
            //se quiser vc pode da um update nele dentro do banco de dados
            q.Get(q.Match(q.Index("user_by_email"), q.Casefold(user.email)))
          )
        );

        return true;

        //Conta como duas operacoes, o melhor e reduzir
        //const userExists = "a"//query
        // if(!userExists) {
        //   await fauna.query(q.Create(q.Collection("users"), { data: { email } }));
        // return true;
        // }
      } catch (error) {}
      return false;
    },
  },
});
