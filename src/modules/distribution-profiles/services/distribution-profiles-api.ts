import axios from 'axios'
import type {
  ListDistributionProfilesRequest,
  ListDistributionProfilesResponse,
} from '../contracts'
import type {
  CreateDistributionProfileInput,
  DistributionProfile,
  UpdateDistributionProfileInput,
} from '../schemas'

export const DistributionProfilesApi = {
  async list(
    brandId: string,
    params: ListDistributionProfilesRequest,
  ): Promise<ListDistributionProfilesResponse> {
    const response = await axios.get<ListDistributionProfilesResponse>(
      `/api/v1/brands/${brandId}/distribution-profiles`,
      { params },
    )
    return response.data
  },

  async create(
    brandId: string,
    data: CreateDistributionProfileInput,
  ): Promise<DistributionProfile> {
    const response = await axios.post<DistributionProfile>(
      `/api/v1/brands/${brandId}/distribution-profiles`,
      data,
    )
    return response.data
  },

  async update(
    brandId: string,
    id: string,
    data: UpdateDistributionProfileInput,
  ): Promise<DistributionProfile> {
    const response = await axios.put<DistributionProfile>(
      `/api/v1/brands/${brandId}/distribution-profiles/${id}`,
      data,
    )
    return response.data
  },

  async archive(brandId: string, id: string): Promise<DistributionProfile> {
    const response = await axios.patch<DistributionProfile>(
      `/api/v1/brands/${brandId}/distribution-profiles/${id}/archive`,
    )
    return response.data
  },
}
