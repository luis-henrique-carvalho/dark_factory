import type { ListBrandsRequest } from '../contracts'

export const brandsQueryKeys = {
  all: ['brands'] as const,
  list: (params: ListBrandsRequest) =>
    [...brandsQueryKeys.all, 'list', params] as const,
}
