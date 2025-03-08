'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
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

const loginSchema = z.object({
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
})

type ILoginForm = z.infer<typeof loginSchema>

export function FormLogin() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const form = useForm<ILoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const {
    formState: { isSubmitting },
  } = form

  async function onSubmit({ email, password }: ILoginForm) {
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    const callbackUrl = searchParams.get('callbackUrl')

    if (res?.ok) {
      return router.replace(callbackUrl || '/painel')
    }

    toast('Erro de autenticação', {
      description: 'Email ou senha incorretos. Por favor, tente novamente.',
    })
  }

  return (
    <div className="w-full space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    placeholder="Digite sua senha"
                    type="password"
                    autoComplete="current-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="flex w-full gap-2">
            Login
            {isSubmitting && (
              <LoaderCircle size={18} className="animate-spin" />
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}
