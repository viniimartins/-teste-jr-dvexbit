import type { Metadata } from 'next'

import { Header } from '@/components/header'

export const metadata: Metadata = {
  title: 'Painel',
}

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <Header />

      <section className="container mx-auto mt-20 flex h-auto w-full max-w-6xl flex-1 flex-col gap-6 py-6">
        {children}
      </section>
    </main>
  )
}
