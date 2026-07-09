import type { QueryClient } from '@tanstack/react-query'
import { brandsQueryKeys } from './brands-query-keys'

export const brandsInvalidations = {
  invalidateList(queryClient: QueryClient) {
    return queryClient.invalidateQueries({ queryKey: brandsQueryKeys.all })
  },
}
