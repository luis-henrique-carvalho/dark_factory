import { createFileRoute } from '@tanstack/react-router'
import { ForgotPassword } from '#/modules/auth/views/forgot-password'

export const Route = createFileRoute('/(auth)/forgot-password')({
  component: ForgotPassword,
})
