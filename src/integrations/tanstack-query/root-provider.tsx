import { QueryCache, QueryClient } from '@tanstack/react-query'
import { handleServerError } from '#/lib/handle-server-error'

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
