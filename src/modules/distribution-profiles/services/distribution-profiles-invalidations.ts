import type { QueryClient } from '@tanstack/react-query'
import { distributionProfilesQueryKeys } from './distribution-profiles-query-keys'

export const distributionProfilesInvalidations = {
  invalidateList(queryClient: QueryClient) {
    return queryClient.invalidateQueries({
      queryKey: distributionProfilesQueryKeys.all,
    })
  },
}
