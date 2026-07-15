import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { DistributionProfilesApi } from '../services/distribution-profiles-api'
import { distributionProfilesInvalidations } from '../services/distribution-profiles-invalidations'
import { distributionProfilesQueryKeys } from '../services/distribution-profiles-query-keys'
import type { ListDistributionProfilesRequest } from '../contracts'
import type {
  CreateDistributionProfileInput,
  UpdateDistributionProfileInput,
} from '../schemas'

export function useDistributionProfilesList(
  brandId: string,
  params: ListDistributionProfilesRequest,
) {
  return useQuery({
    queryKey: distributionProfilesQueryKeys.list(params),
    queryFn: () => DistributionProfilesApi.list(brandId, params),
  })
}

export function useDistributionProfilesMutations() {
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: ({
      brandId,
      data,
    }: {
      brandId: string
      data: CreateDistributionProfileInput
    }) => DistributionProfilesApi.create(brandId, data),
    onSuccess: () => {
      toast.success('Distribution profile created successfully')
      distributionProfilesInvalidations.invalidateList(queryClient)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      brandId,
      data,
    }: {
      brandId: string
      id: string
      data: UpdateDistributionProfileInput
    }) => DistributionProfilesApi.update(brandId, id, data),
    onSuccess: () => {
      toast.success('Distribution profile updated successfully')
      distributionProfilesInvalidations.invalidateList(queryClient)
    },
  })

  const archiveMutation = useMutation({
    mutationFn: ({ brandId, id }: { brandId: string; id: string }) =>
      DistributionProfilesApi.archive(brandId, id),
    onSuccess: () => {
      toast.success('Distribution profile archived successfully')
      distributionProfilesInvalidations.invalidateList(queryClient)
    },
  })

  return {
    createProfile: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateProfile: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    archiveProfile: archiveMutation.mutateAsync,
    isArchiving: archiveMutation.isPending,
  }
}
