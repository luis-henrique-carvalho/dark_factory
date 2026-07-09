import { BrandNotFoundError } from '../errors/brands.errors'
import { BrandsRepository } from '../repositories/brands.repository'
import type { CreateBrandDto, UpdateBrandDto } from '../dtos/brands.dto'
import { createPaginatedResponse } from '#/lib/query/list-query'
import type { ListBrandsRequest } from '../../contracts'

export class BrandsService {
  static async list(params: ListBrandsRequest & { userId: string }) {
    const { items, total } = await BrandsRepository.findPage(params)

    return createPaginatedResponse(items, { ...params, total })
  }

  static async create(userId: string, data: CreateBrandDto) {
    return BrandsRepository.create({
      userId,
      name: data.name,
      niche: data.niche,
      language: data.language,
      status: 'active',
    })
  }

  static async update(userId: string, brandId: string, data: UpdateBrandDto) {
    const updated = await BrandsRepository.updateForUser({
      id: brandId,
      userId,
      data,
    })

    if (!updated) throw new BrandNotFoundError()
    return updated
  }

  static async archive(userId: string, brandId: string) {
    const archived = await BrandsRepository.updateForUser({
      id: brandId,
      userId,
      data: { status: 'archived' },
    })

    if (!archived) throw new BrandNotFoundError()
    return archived
  }
}
