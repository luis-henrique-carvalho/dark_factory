import type { ListDistributionProfilesRequest } from '../contracts'

export const distributionProfilesQueryKeys = {
  all: ['distribution-profiles'] as const,
  list: (params: ListDistributionProfilesRequest) =>
    [...distributionProfilesQueryKeys.all, 'list', params] as const,
}
