'use client'

import { TaskStatus } from '@prisma/client'
import { format } from 'date-fns'
import { MoreHorizontal, Search } from 'lucide-react'
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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useModal } from '@/hooks/use-modal'
import { statusValue } from '@/utils/status'

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
    isFetching,
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

  return (
    <>
      <div className="flex w-full flex-col justify-between gap-4 sm:flex-row">
        <div className="flex w-full flex-col gap-4 sm:flex-row">
          <div className="relative w-full">
            <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
            <Input
              placeholder="Pesquisar por nome"
              {...register('name')}
              className="w-full pl-8"
            />
          </div>

          <Select
            onValueChange={(value: TaskStatus) => setValue('status', value)}
            defaultValue={searchStatusValue}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TaskStatus.DONE}>Concluído</SelectItem>
              <SelectItem value={TaskStatus.IN_PROGRESS}>
                Em progresso
              </SelectItem>
              <SelectItem value={TaskStatus.PENDING}>Pendente</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={() => actionsModalTask.open()}>Adicionar Task</Button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {tasks?.length === 0 && (
          <p className="text-2xl">
            Nenhuma{' '}
            <span className="text-muted-foreground font-semibold">TASK</span>{' '}
            encontrada!
          </p>
        )}

        {isFetching &&
          tasks?.map((task) => {
            const { id } = task

            return <Skeleton key={id} className="h-96 w-full" />
          })}

        {!isFetching &&
          tasks?.map((task) => {
            const { name, status, description, createdAt } = task

            const { variant, statusName } = statusValue(status)

            return (
              <Card key={task.id} className="h-96 w-full">
                <CardHeader className="flex-row justify-between">
                  <CardTitle className="truncate text-xl">{name}</CardTitle>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-[2rem] w-[2rem] p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-[1rem] w-[1rem]" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => actionsModalTask.open(task)}
                      >
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => actionsAlertDialogTask.open(task)}
                      >
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-8 overflow-auto text-base">
                    {description}
                  </p>
                </CardContent>
                <CardFooter className="m-0 mt-auto flex items-end justify-between">
                  <time className="text-xs font-medium">
                    {format(createdAt, 'dd/MM/yyyy')}
                  </time>

                  <Badge className="h-8" variant={variant}>
                    {statusName}
                  </Badge>
                </CardFooter>
              </Card>
            )
          })}
      </div>

      <Dialog open={isOpenModalTask} onOpenChange={actionsModalTask.close}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Task</DialogTitle>
            <DialogDescription>Preencha os detalhes da Task.</DialogDescription>
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
              Deseja realmente deletar esta Task?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso irá remover permanentemente
              a Task e todos os dados associados a ele.
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
