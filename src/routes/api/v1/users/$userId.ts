import { createFileRoute } from '@tanstack/react-router'
import { UsersController } from '#/modules/users/server'
import { requestLoggerMiddleware } from '#/lib/server/request-logger-middleware'
import { authMiddleware } from '#/lib/auth/auth-middleware'

export const Route = createFileRoute('/api/v1/users/$userId')({
  server: {
    middleware: [requestLoggerMiddleware, authMiddleware],
    handlers: {
      GET: UsersController.handleDetail,
      PUT: UsersController.handleUpdate,
      DELETE: UsersController.handleDelete,
    },
  },
})
