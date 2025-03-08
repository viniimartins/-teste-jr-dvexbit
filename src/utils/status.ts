import type { TaskStatus } from '@prisma/client'

export const statusValue = (value: TaskStatus) => {
  switch (value) {
    case 'DONE':
      return { variant: 'outline' as const, statusName: 'Concluido' }
    case 'IN_PROGRESS':
      return { variant: 'default' as const, statusName: 'Em progresso' }
    case 'PENDING':
      return { variant: 'destructive' as const, statusName: 'Pendente' }
    default:
      return { variant: 'default' as const, statusName: 'Não encontrado' }
  }
}
