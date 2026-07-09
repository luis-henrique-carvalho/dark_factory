import { handleServerError } from '#/lib/server/handle-server-error'
import { QueryCache, QueryClient } from '@tanstack/react-query'

export function getContext() {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: {
        onError: (error) => {
          handleServerError(error)
        },
      },
    },
    queryCache: new QueryCache({
      onError: (error) => {
        handleServerError(error)
      },
    }),
  })

  return {
    queryClient,
  }
}
export default function TanstackQueryProvider() {}
