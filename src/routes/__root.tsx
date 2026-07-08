import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  Outlet,
  Link,
} from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getCookie as getServerCookie } from '@tanstack/react-start/server'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import appCss from '../styles/index.css?url'

import type { QueryClient } from '@tanstack/react-query'

import { getCookie as getClientCookie } from '#/lib/cookies'
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
import type { Theme } from '#/context/theme-provider'

interface MyRouterContext {
  queryClient: QueryClient
}

function isTheme(value: string | undefined): value is Theme {
  return value === 'dark' || value === 'light' || value === 'system'
}

const getInitialTheme = createServerFn({ method: 'GET' }).handler(() => {
  const theme = getServerCookie('vite-ui-theme')
  return isTheme(theme) ? theme : 'system'
})

export const Route = createRootRouteWithContext<MyRouterContext>()({
  loader: () => getInitialTheme(),
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
  const initialTheme = Route.useLoaderData()
  const defaultOpen = getClientCookie('sidebar_state') !== 'false'

  return (
    <RootDocument initialTheme={initialTheme}>
      <ThemeProvider defaultTheme={initialTheme}>
        <FontProvider>
          <DirectionProvider>
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
            <Toaster />
          </DirectionProvider>
        </FontProvider>
      </ThemeProvider>
    </RootDocument>
  )
}

function RootDocument({
  children,
  initialTheme,
}: {
  children: React.ReactNode
  initialTheme: Theme
}) {
  const themeClassName = initialTheme === 'system' ? undefined : initialTheme

  return (
    <html lang="en" className={themeClassName} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
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
  )
}
