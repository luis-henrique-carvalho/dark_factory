import { createFileRoute } from '@tanstack/react-router'
import { authMiddleware } from '#/lib/auth/auth-middleware'
import { requestLoggerMiddleware } from '#/lib/server/request-logger-middleware'
import { BrandsController } from '#/modules/brands/server'

export const Route = createFileRoute('/api/v1/brands/')({
  server: {
    middleware: [requestLoggerMiddleware, authMiddleware],
    handlers: {
      GET: BrandsController.handleList,
      POST: BrandsController.handleCreate,
    },
  },
})
