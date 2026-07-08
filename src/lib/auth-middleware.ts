import { createMiddleware } from '@tanstack/react-start'
import { auth } from '#/lib/auth'

export type AuthContext = {
  session: NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>
}

export const authMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const session = await auth.api.getSession({ headers: request.headers })

    if (!session) {
      // If in local development, bypass 401 and inject a mock session for testing CRUD
      if (process.env.NODE_ENV === 'development') {
        return next({
          context: {
            session: {
              user: {
                id: 'dev-admin-id',
                name: 'Dev Admin',
                email: 'admin@darkfactory.ai',
                emailVerified: true,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
              session: {
                id: 'dev-session-id',
                userId: 'dev-admin-id',
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
                token: 'dev-token',
                createdAt: new Date(),
                updatedAt: new Date(),
                userAgent: 'dev',
                ipAddress: '127.0.0.1',
              },
            },
          },
        })
      }

      throw Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return next({
      context: {
        session,
      },
    })
  },
)
