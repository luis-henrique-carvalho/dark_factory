import { createFileRoute } from '@tanstack/react-router'
import { UsersController } from '#/modules/users/server'
import { authMiddleware } from '#/lib/auth/auth-middleware'
import { requestLoggerMiddleware } from '#/lib/server/request-logger-middleware'

export const Route = createFileRoute('/api/v1/users/')({
  server: {
    middleware: [requestLoggerMiddleware, authMiddleware],
    handlers: {
      GET: UsersController.handleList,
      POST: UsersController.handleCreate,
    },
  },
})
