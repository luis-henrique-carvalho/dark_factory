import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { getCookie } from '#/lib/cookies'
import { cn } from '#/lib/utils'
import { LayoutProvider } from '#/context/layout-provider'
import { SearchProvider } from '#/context/search-provider'
import { SidebarInset, SidebarProvider } from '#/components/ui/sidebar'
import { AppSidebar } from '#/components/layout/app-sidebar'
import { SkipToMain } from '#/components/skip-to-main'
import { getSession } from '#/lib/get-session'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    const session = await getSession()
    if (!session) {
      throw redirect({
        to: '/sign-in',
        search: {
          redirect: location.href,
        },
      })
    }
    return {
      session,
    }
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  const defaultOpen = getCookie('sidebar_state') !== 'false'

  return (
    <SearchProvider>
      <LayoutProvider>
        <SidebarProvider defaultOpen={defaultOpen}>
          <SkipToMain />
          <AppSidebar />
          <SidebarInset
            className={cn(
              '@container/content',
              'has-data-[layout=fixed]:h-svh',
              'peer-data-[variant=inset]:has-data-[layout=fixed]:h-[calc(100svh-(var(--spacing)*4))]',
            )}
          >
            <Outlet />
          </SidebarInset>
        </SidebarProvider>
      </LayoutProvider>
    </SearchProvider>
  )
}
