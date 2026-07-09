import { createMiddleware } from '@tanstack/react-start'
import { getSession } from './get-session'

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const session = await getSession()

  if (!session) {
    throw Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return next({
    context: {
      session,
    },
  })
})
