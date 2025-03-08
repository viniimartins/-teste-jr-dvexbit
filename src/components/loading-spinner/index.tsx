import { LoaderCircle } from 'lucide-react'

export function LoadingSpinner() {
  return (
    <div className="flex h-full items-center justify-center">
      <LoaderCircle className="animate-spin" size={40} />
    </div>
  )
}
