import { createMiddleware } from '@tanstack/react-start'
import { auth } from '#/lib/auth'

export type AuthContext = {
  session: NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>
}

export const authMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const session = await auth.api.getSession({ headers: request.headers })

    if (!session) {
      throw Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return next({
      context: {
        session,
      },
    })
  },
)
