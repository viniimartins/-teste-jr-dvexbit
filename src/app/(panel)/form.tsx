import { zodResolver } from '@hookform/resolvers/zod'
import { TaskStatus } from '@prisma/client'
import { QueryKey } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ModalActions } from '@/types/modal'

import { useCreateTask } from './hooks/use-create-task'
import { useUpdateTask } from './hooks/use-update-task'
import { ITask } from './types'

interface Props {
  toUpdateModalTask: ITask | null
  queryKey: QueryKey
  actionsModalTask: ModalActions<ITask>
}

const TaskSchema = z.object({
  name: z.string().min(3, {
    message: 'O nome do Task deve ter pelo menos 3 caracteres.',
  }),
  description: z.string().min(3, {
    message: 'A descrição do Task deve ter pelo menos 3 caracteres.',
  }),
  status: z
    .enum([TaskStatus.PENDING, TaskStatus.IN_PROGRESS, TaskStatus.DONE])
    .optional(),
})

type IAddTaskFormData = z.infer<typeof TaskSchema>

export function FormContainer(props: Props) {
  const { toUpdateModalTask, queryKey, actionsModalTask } = props

  const { mutateAsync: handleCreateTask, isPending: isPendingCreateTask } =
    useCreateTask({
      queryKey,
    })

  const { mutateAsync: handleUpdateTask, isPending: isPendingUpdateTask } =
    useUpdateTask({
      queryKey,
    })

  const form = useForm<IAddTaskFormData>({
    resolver: zodResolver(TaskSchema),
    defaultValues: {
      name: toUpdateModalTask?.name ?? '',
      description: toUpdateModalTask?.description ?? '',
      status: toUpdateModalTask?.status,
    },
  })

  const {
    formState: { isSubmitting },
    reset,
  } = form

  function onSubmit(TaskData: IAddTaskFormData) {
    if (!toUpdateModalTask) {
      handleCreateTask(
        { task: TaskData },
        {
          onSuccess: () => {
            toast('Task criado com sucesso!', {
              description: 'O Task foi adicionado à lista.',
            })
          },
        },
      )
    }

    if (toUpdateModalTask) {
      handleUpdateTask(
        { task: { ...TaskData, id: toUpdateModalTask.id } },
        {
          onSuccess: () => {
            toast('Task editado com sucesso!', {
              description: 'O Task foi atualiado na lista.',
            })
          },
        },
      )
    }

    actionsModalTask.close()
    reset()
  }

  const isLoading = isPendingCreateTask || isPendingUpdateTask || isSubmitting

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o nome do Task" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Input placeholder="Digite a descrição do Task" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue
                        className="w-full"
                        placeholder="Selecione o status"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={TaskStatus.DONE}>Concluido</SelectItem>
                    <SelectItem value={TaskStatus.IN_PROGRESS}>
                      Em progresso
                    </SelectItem>
                    <SelectItem value={TaskStatus.PENDING}>Pendente</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          Salvar
          {isLoading && <LoaderCircle size={18} className="animate-spin" />}
        </Button>
      </form>
    </Form>
  )
}
