import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { sessionQueryOptions } from '#/lib/auth/session-query'

export const Route = createFileRoute('/(auth)')({
  beforeLoad: async ({ context }) => {
    const session = await context.queryClient.ensureQueryData(
      sessionQueryOptions,
    )
    if (session) {
      throw redirect({
        to: '/',
      })
    }
  },
  component: Outlet,
})
