import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  Outlet,
  Link,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import appCss from '../styles/index.css?url'

import type { QueryClient } from '@tanstack/react-query'

import { getCookie } from '#/lib/cookies'
import { cn } from '#/lib/utils'
import { LayoutProvider } from '#/context/layout-provider'
import { SearchProvider } from '#/context/search-provider'
import { SidebarInset, SidebarProvider } from '#/components/ui/sidebar'
import { AppSidebar } from '#/components/layout/app-sidebar'
import { SkipToMain } from '#/components/skip-to-main'
import { ThemeProvider } from '#/context/theme-provider'
import { FontProvider } from '#/context/font-provider'
import { DirectionProvider } from '#/context/direction-provider'
import { Toaster } from '#/components/ui/sonner'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Dark Factory',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  component: RootComponent,
  notFoundComponent: () => {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-2xl font-bold">404 - Page Not Found</h2>
        <p className="text-muted-foreground">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/"
          className="text-sm font-medium text-primary hover:underline"
        >
          Go back home
        </Link>
      </div>
    )
  },
})

function RootComponent() {
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

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <FontProvider>
        <DirectionProvider>
          <html lang="en">
            <head>
              <HeadContent />
            </head>
            <body>
              {children}
              <Toaster />
              <TanStackDevtools
                config={{
                  position: 'bottom-right',
                }}
                plugins={[
                  {
                    name: 'Tanstack Router',
                    render: <TanStackRouterDevtoolsPanel />,
                  },
                  TanStackQueryDevtools,
                ]}
              />
              <Scripts />
            </body>
          </html>
        </DirectionProvider>
      </FontProvider>
    </ThemeProvider>
  )
}
