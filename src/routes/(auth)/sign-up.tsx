import { createFileRoute } from '@tanstack/react-router'
import { SignUp } from '#/modules/auth/views/sign-up'

export const Route = createFileRoute('/(auth)/sign-up')({
  component: SignUp,
})
