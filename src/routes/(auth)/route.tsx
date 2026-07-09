import { getSession } from '#/lib/auth/get-session'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

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
