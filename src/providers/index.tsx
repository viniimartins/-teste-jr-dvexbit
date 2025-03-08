'use client'

import { type PropsWithChildren } from 'react'
import React from 'react'

import { Toaster } from '@/components/ui/sonner'

import { ThemeProvider } from './theme'

export function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <Toaster />
    </ThemeProvider>
  )
}
