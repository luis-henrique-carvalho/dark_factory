import axios from 'axios'
import type { Brand, CreateBrandInput, UpdateBrandInput } from '../schemas'
import type { ListBrandsRequest, ListBrandsResponse } from '../contracts'

export const BrandsApi = {
  async list(params: ListBrandsRequest): Promise<ListBrandsResponse> {
    const response = await axios.get<ListBrandsResponse>('/api/v1/brands', {
      params,
    })
    return response.data
  },

  async create(data: CreateBrandInput): Promise<Brand> {
    const response = await axios.post<Brand>('/api/v1/brands', data)
    return response.data
  },

  async update(id: string, data: UpdateBrandInput): Promise<Brand> {
    const response = await axios.put<Brand>(`/api/v1/brands/${id}`, data)
    return response.data
  },

  async archive(id: string): Promise<Brand> {
    const response = await axios.patch<Brand>(`/api/v1/brands/${id}/archive`)
    return response.data
  },
}
