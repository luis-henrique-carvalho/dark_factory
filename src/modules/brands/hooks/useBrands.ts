import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { BrandsApi } from '../services/brands-api'
import { brandsInvalidations } from '../services/brands-invalidations'
import { brandsQueryKeys } from '../services/brands-query-keys'
import type { ListBrandsRequest } from '../contracts'
import type { CreateBrandInput, UpdateBrandInput } from '../schemas'

export function useBrandsList(params: ListBrandsRequest) {
  return useQuery({
    queryKey: brandsQueryKeys.list(params),
    queryFn: () => BrandsApi.list(params),
  })
}

export function useBrandsMutations() {
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: (data: CreateBrandInput) => BrandsApi.create(data),
    onSuccess: () => {
      toast.success('Brand created successfully')
      brandsInvalidations.invalidateList(queryClient)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBrandInput }) =>
      BrandsApi.update(id, data),
    onSuccess: () => {
      toast.success('Brand updated successfully')
      brandsInvalidations.invalidateList(queryClient)
    },
  })

  const archiveMutation = useMutation({
    mutationFn: (id: string) => BrandsApi.archive(id),
    onSuccess: () => {
      toast.success('Brand archived successfully')
      brandsInvalidations.invalidateList(queryClient)
    },
  })

  return {
    createBrand: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateBrand: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    archiveBrand: archiveMutation.mutateAsync,
    isArchiving: archiveMutation.isPending,
  }
}
