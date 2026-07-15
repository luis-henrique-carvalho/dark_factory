import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Loader2, UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { IconFacebook, IconGithub } from '#/assets/brand-icons'
import { authClient } from '#/lib/auth/auth-client'
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
import { PasswordInput } from '#/components/password-input'

const formSchema = z
  .object({
    email: z
      .string()
      .email('Please enter a valid email address.')
      .min(1, 'Please enter your email.'),
    password: z
      .string()
      .min(1, 'Please enter your password.')
      .min(7, 'Password must be at least 7 characters long.'),
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  })

export function SignUpForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLFormElement>) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)

    const signUpPromise = authClient.signUp
      .email({
        email: data.email,
        password: data.password,
        name: data.email.split('@')[0],
      })
      .then(async (res) => {
        if (res.error) {
          throw new Error(res.error.message || 'Registration failed.')
        }
        return res.data
      })

    toast.promise(signUpPromise, {
      loading: 'Creating account...',
      success: () => {
        setIsLoading(false)
        navigate({ to: '/', replace: true })
        return `Account created successfully! Welcome.`
      },
      error: (err) => {
        setIsLoading(false)
        return err.message || 'Failed to create account.'
      },
    })
  }

  const handleSocialSignIn = async (provider: 'github' | 'facebook') => {
    setIsLoading(true)
    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: '/',
      })
      if (error) {
        toast.error(error.message || `Failed to sign in with ${provider}`)
      }
    } catch (err: any) {
      toast.error(err.message || `Failed to sign in with ${provider}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
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
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput
                  autoComplete="new-password"
                  placeholder="********"
                  required
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <PasswordInput
                  autoComplete="new-password"
                  placeholder="********"
                  required
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="mt-2" disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin" /> : <UserPlus />}
          Create Account
        </Button>

        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            className="w-full"
            type="button"
            disabled={isLoading}
            onClick={() => handleSocialSignIn('github')}
          >
            <IconGithub className="h-4 w-4" /> GitHub
          </Button>
          <Button
            variant="outline"
            className="w-full"
            type="button"
            disabled={isLoading}
            onClick={() => handleSocialSignIn('facebook')}
          >
            <IconFacebook className="h-4 w-4" /> Facebook
          </Button>
        </div>
      </form>
    </Form>
  )
}
