import { createFileRoute } from '@tanstack/react-router'
import { UsersController } from '#/modules/users/server'
import { authMiddleware } from '#/modules/auth/server/auth-middleware'
import { requestLoggerMiddleware } from '#/lib/request-logger-middleware'

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
