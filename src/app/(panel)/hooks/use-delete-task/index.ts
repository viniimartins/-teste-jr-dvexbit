import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { api } from '@/service/api'
import { QueryKeyProps } from '@/types/queryKeyProps'

import type { ITask } from '../../types'

interface Task {
  taskId: string
}

async function deleteTask({ taskId }: Task) {
  const { data } = await api.delete(`/task/${taskId}`)

  return data
}

export function useDeleteTask({ queryKey }: QueryKeyProps) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteTask,
    mutationKey: ['delete-task'],
    onMutate: async ({ taskId }) => {
      await queryClient.cancelQueries({ queryKey })

      const previousTask = queryClient.getQueryData<ITask[]>(queryKey)

      queryClient.setQueryData(queryKey, (old?: ITask[]) => {
        if (old) {
          return old.filter((task) => task.id !== taskId)
        }
        return old
      })

      return { previousTask }
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousTask)
      toast('Opss, algo deu errado!', {
        description: 'Erro ao excluir a task.',
      })
    },
  })
}
