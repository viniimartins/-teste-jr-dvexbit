'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

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

import { useCreateAccount } from './hooks/use-create-account'

const createAccountSchema = z
  .object({
    name: z
      .string({ required_error: 'Este campo é obrigatório.' })
      .min(1, { message: 'Este campo é obrigatório.' }),
    email: z
      .string({ required_error: 'Este campo é obrigatório.' })
      .email({ message: 'Insira um endereço de e-mail válido.' }),
    password: z
      .string({ required_error: 'Este campo é obrigatório' })
      .min(8, { message: 'Deve ter pelo menos 8 caracteres.' })
      .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message:
          'A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula e um número.',
      }),
    confirm_password: z
      .string({ required_error: 'Este campo é obrigatório' })
      .min(8, { message: 'Deve ter pelo menos 8 caracteres.' }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'As senhas não coincidem.',
    path: ['confirm_password'],
  })

type ICreateAccountForm = z.infer<typeof createAccountSchema>

export function FormLogin() {
  const router = useRouter()

  const { mutateAsync: handleCreateAccount, isPending } = useCreateAccount()

  const form = useForm<ICreateAccountForm>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirm_password: '',
    },
  })

  const {
    formState: { isSubmitting },
    trigger,
    watch,
  } = form

  const { passwordValue, confirmPasswordValue } = {
    confirmPasswordValue: watch('confirm_password'),
    passwordValue: watch('password'),
  }

  async function onSubmit({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    confirm_password,
    ...rawAccount
  }: ICreateAccountForm) {
    handleCreateAccount(
      { account: rawAccount },
      {
        onSuccess: () => {
          toast('Conta criada com sucesso!')

          router.push(`/login`)
        },
      },
    )
  }

  const isLoading = isPending || isSubmitting

  useEffect(() => {
    if (passwordValue && confirmPasswordValue) {
      trigger('confirm_password')
    }
  }, [passwordValue, confirmPasswordValue, trigger])

  return (
    <div className="w-full space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Digite seu nome completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Digite seu e-mail"
                    type="email"
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Crie uma senha segura"
                    type="password"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirm_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar Senha</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Confirme sua senha"
                    type="password"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="flex w-full gap-2">
            Salvar
            {isLoading && <LoaderCircle size={18} className="animate-spin" />}
          </Button>
        </form>
      </Form>
    </div>
  )
}
