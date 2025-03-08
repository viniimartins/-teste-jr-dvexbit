import type { TaskStatus } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'

import { api } from '@/service/api'
import { TaskMock } from '@/shared/mock/tasks'

import type { ITask } from '../../types'

interface Props {
  name: string
  status: TaskStatus
}

async function get(name: string, status: TaskStatus) {
  const { data } = await api.get<ITask[]>('/task', {
    params: { name, status },
  })

  return data
}

export function useGetTasks({ name, status }: Props) {
  const queryKey = ['get-tasks', name, status]

  const query = useQuery({
    queryKey,
    queryFn: () => get(name, status),
    placeholderData: TaskMock,
  })

  return { ...query, queryKey }
}
