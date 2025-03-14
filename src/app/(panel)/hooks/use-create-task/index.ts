import type { TaskStatus } from '@prisma/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { api } from '@/service/api'
import { QueryKeyProps } from '@/types/queryKeyProps'

interface Task {
  name: string
  description: string
  status?: TaskStatus
}

export interface CreateTask {
  task: Task
}

async function create({ task }: CreateTask) {
  const { data } = await api.post('/task', {
    ...task,
  })

  return data
}

export function useCreateTask({ queryKey }: QueryKeyProps) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: create,
    mutationKey: ['create-task'],
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
    onError: () => {
      toast('Opss, algo deu errado!', {
        description: 'Erro ao criar a task.',
      })
    },
  })
}
