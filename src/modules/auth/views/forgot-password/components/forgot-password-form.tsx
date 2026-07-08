import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { ArrowRight, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { authClient } from '#/lib/auth-client'
import { cn } from '#/lib/utils'
import { Button } from '#/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '#/components/ui/form'
import { Input } from '#/components/ui/input'

const formSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address.')
    .min(1, 'Please enter your email.'),
})

export function ForgotPasswordForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLFormElement>) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)

    const forgetPasswordPromise = authClient
      .requestPasswordReset({
        email: data.email,
        redirectTo: `${window.location.origin}/reset-password`,
      })
      .then((res) => {
        if (res.error) {
          throw new Error(res.error.message || 'Failed to send link.')
        }
        return res.data
      })

    toast.promise(forgetPasswordPromise, {
      loading: 'Sending email...',
      success: () => {
        setIsLoading(false)
        form.reset()
        navigate({ to: '/otp' })
        return `Password reset link sent to ${data.email}`
      },
      error: (err) => {
        setIsLoading(false)
        return err.message || 'Failed to send password reset email.'
      },
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-2', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  autoComplete="username"
                  required
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="mt-2" disabled={isLoading}>
          Continue
          {isLoading ? <Loader2 className="animate-spin" /> : <ArrowRight />}
        </Button>
      </form>
    </Form>
  )
}
