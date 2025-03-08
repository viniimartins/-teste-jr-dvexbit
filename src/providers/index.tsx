'use client'

import { type PropsWithChildren } from 'react'
import React from 'react'

import { Toaster } from '@/components/ui/sonner'

import { NextAuthProvider } from './next-auth'
import { ReactQueryProvider } from './react-query'
import { ThemeProvider } from './theme'

export function Providers({ children }: PropsWithChildren) {
  return (
    <NextAuthProvider>
      <ReactQueryProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </ReactQueryProvider>
    </NextAuthProvider>
  )
}
