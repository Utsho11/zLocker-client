import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { loginAPI } from "@/api/auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials || {};

        if (!email || !password) return null;

        const res = await loginAPI(email, password);
        const accessToken = res?.data?.accessToken;

        if (accessToken) {
          return { accessToken }; // return token here
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user?.accessToken) {
        token.accessToken = user.accessToken;
      }

      if (trigger === "update" && session?.accessToken) {
        //   console.log(trigger);

        //   console.log("Updating access token in JWT callback");

        token.accessToken = session.accessToken;
      }

      return token;
    },
    async session({ session, token }) {
      session.user.accessToken = token.accessToken;

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
