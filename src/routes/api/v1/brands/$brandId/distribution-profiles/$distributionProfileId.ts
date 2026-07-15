import { createFileRoute } from '@tanstack/react-router'
import { authMiddleware } from '#/lib/auth/auth-middleware'
import { requestLoggerMiddleware } from '#/lib/server/request-logger-middleware'
import { DistributionProfilesController } from '#/modules/distribution-profiles/server'

export const Route = createFileRoute(
  '/api/v1/brands/$brandId/distribution-profiles/$distributionProfileId',
)({
  server: {
    middleware: [requestLoggerMiddleware, authMiddleware],
    handlers: {
      PUT: DistributionProfilesController.handleUpdate,
    },
  },
})
