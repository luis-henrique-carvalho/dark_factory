import { createFileRoute } from '@tanstack/react-router'
import { UsersController } from '#/modules/users/server/users.controller'
import { authMiddleware } from '#/modules/auth/server/auth-middleware'

export const Route = createFileRoute('/api/v1/users/')({
  server: {
    middleware: [authMiddleware],
    handlers: {
      GET: UsersController.handleList,
      POST: UsersController.handleCreate,
    },
  },
})
