import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { getSession } from '#/lib/auth/get-session'

export const Route = createFileRoute('/(auth)')({
  beforeLoad: async () => {
    const session = await getSession()
    if (session) {
      throw redirect({
        to: '/',
      })
    }
  },
  component: Outlet,
})
