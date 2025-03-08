import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <div className="text-primary mx-auto h-12 w-12" />
        <h1 className="text-foreground mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Ops, página não encontrada!
        </h1>
        <p className="text-muted-foreground mt-4">
          A página que você está procurando não existe ou foi movida.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary inline-flex items-center rounded-md px-4 py-2 text-sm font-medium shadow-sm transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
            prefetch={false}
          >
            Voltar para a Página Inicial
          </Link>
        </div>
      </div>
      <title>Ops! Página não encontrada!</title>
    </div>
  )
}
