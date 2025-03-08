import { jwtDecode } from 'jwt-decode'
import { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

import { env } from '@/env'
import { api } from '@/service/api'
import { DecodedToken } from '@/types/decoded-token'

interface SignIn {
  token: string
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'E-mail', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        const { data } = await api.post<SignIn>(
          `${env.NEXT_PUBLIC_API_URL}/api/auth/session`,
          {
            email: credentials?.email,
            password: credentials?.password,
          },
        )

        if (!data) {
          return null
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { exp, iat, ...user } = jwtDecode<DecodedToken>(data.token)

        return { ...data, ...user, token: data.token }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === 'update') {
        return { ...session }
      }

      if (user) {
        token.user = user
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user = token.user
      }

      return session
    },
  },

  session: {
    strategy: 'jwt',
  },
  debug: true,
}
