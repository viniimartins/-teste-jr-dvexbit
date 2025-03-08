'use client'

import { TaskStatus } from '@prisma/client'
import { Search } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useModal } from '@/hooks/use-modal'

import { FormContainer } from './form'
import { useDeleteTask } from './hooks/use-delete-task'
import { useGetTasks } from './hooks/use-get-tasks'
import { ITask } from './types'

const searchsInputs = z.object({
  name: z.string(),
  status: z.enum(
    [TaskStatus.PENDING, TaskStatus.IN_PROGRESS, TaskStatus.DONE],
    {
      required_error: 'Por favor, selecione o status da tarefa.',
    },
  ),
})

type ISearchInputs = z.infer<typeof searchsInputs>

export function Content() {
  const {
    isOpen: isOpenModalTask,
    actions: actionsModalTask,
    target: toUpdateModalTask,
  } = useModal<ITask>()

  const {
    isOpen: isOpenAlertDialogTask,
    actions: actionsAlertDialogTask,
    target: toDeleteAlertDialogTask,
  } = useModal<ITask>()

  const { register, watch, setValue } = useForm<ISearchInputs>()

  const { name: searchNameTaskValue, status: searchStatusValue } = watch()

  const {
    data: tasks,
    queryKey,
    // isFetching,
  } = useGetTasks({ name: searchNameTaskValue, status: searchStatusValue })

  const { mutateAsync: deleteTask } = useDeleteTask({ queryKey })

  const handleDeleteTask = (id: string) => {
    deleteTask(
      { taskId: id },
      {
        onSuccess: () => {
          toast('Task excluido com sucesso!', {
            description: 'O Task foi excluido à lista.',
          })
        },
      },
    )
    actionsAlertDialogTask.close()
  }

  console.log(tasks)

  return (
    <>
      <div className="flex w-full justify-between">
        <div className="flex gap-4">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
            <Input
              placeholder="Pesquisar por nome"
              {...register('name')}
              className="w-50 pl-8"
            />
          </div>

          <Select
            onValueChange={(value: TaskStatus) => setValue('status', value)}
            defaultValue={searchStatusValue}
          >
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TaskStatus.DONE}>Concluido</SelectItem>
              <SelectItem value={TaskStatus.IN_PROGRESS}>
                Em progresso
              </SelectItem>
              <SelectItem value={TaskStatus.PENDING}>Pendente</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={() => actionsModalTask.open()}>Adicionar Task</Button>
      </div>

      <Dialog open={isOpenModalTask} onOpenChange={actionsModalTask.close}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Task</DialogTitle>
            <DialogDescription>Preencha os detalhes do Task.</DialogDescription>
          </DialogHeader>
          <FormContainer
            toUpdateModalTask={toUpdateModalTask}
            queryKey={queryKey}
            actionsModalTask={actionsModalTask}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isOpenAlertDialogTask}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Deseja realmente deletar este Task?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso irá remover permanentemente
              o Task e todos os dados associados a ele.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={actionsAlertDialogTask.close}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                handleDeleteTask(toDeleteAlertDialogTask?.id ?? '')
              }
            >
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
