'use client'

import { SessionProvider } from 'next-auth/react'
import type { PropsWithChildren } from 'react'

export function NextAuthProvider(props: PropsWithChildren) {
  const { children } = props

  return <SessionProvider basePath="/auth">{children}</SessionProvider>
}
