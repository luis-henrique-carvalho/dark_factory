import { createFileRoute } from '@tanstack/react-router'
import { UsersController } from '#/modules/users/server'
import { authMiddleware } from '#/modules/auth/server/auth-middleware'

export const Route = createFileRoute('/api/v1/users/me')({
  server: {
    middleware: [authMiddleware],
    handlers: {
      GET: UsersController.handleMe,
    },
  },
})
