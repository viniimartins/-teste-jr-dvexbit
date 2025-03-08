import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { api } from '@/service/api'
import { QueryKeyProps } from '@/types/queryKeyProps'

import type { ITask } from '../../types'

interface Task {
  id: string
  name: string
  description: string
  status?: string
}

export interface UpdateTask {
  task: Task
}

async function update({ task }: UpdateTask) {
  const { id, ...rawTask } = task

  const { data } = await api.put(`/task/${id}`, {
    ...rawTask,
  })

  return data
}

export function useUpdateTask({ queryKey }: QueryKeyProps) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: update,
    mutationKey: ['update-task'],
    onMutate: async ({ task: { description, name, id, status } }) => {
      await queryClient.cancelQueries({ queryKey })

      const previousTasks = queryClient.getQueryData<ITask[]>(queryKey)

      queryClient.setQueryData(queryKey, (old?: ITask[]) => {
        if (old) {
          return old.map((task) =>
            task.id === id ? { ...task, description, name, status } : task,
          )
        }
        return old
      })

      return { previousTasks }
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousTasks)
      toast('Opss, algo deu errado!', {
        description: 'Erro ao editar a task.',
      })
    },
  })
}
