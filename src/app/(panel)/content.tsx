'use client'

import { Button } from '@/components/ui/button'

import { useGetTasks } from './hooks/use-get-tasks'

export function Content() {
  const { data: getTasks, queryKey, isFetching } = useGetTasks()

  console.log(getTasks)

  return (
    <div>
      <Button>TESTE</Button>
    </div>
  )
}
