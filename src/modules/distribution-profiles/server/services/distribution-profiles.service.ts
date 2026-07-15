import { createPaginatedResponse } from '#/lib/query/list-query'
import type { ListDistributionProfilesRequest } from '../../contracts'
import type {
  CreateDistributionProfileDto,
  UpdateDistributionProfileDto,
} from '../dtos/distribution-profiles.dto'
import { DistributionProfileNotFoundError } from '../errors/distribution-profiles.errors'
import { DistributionProfilesRepository } from '../repositories/distribution-profiles.repository'

function toRecord(input: CreateDistributionProfileDto) {
  const { defaultTags, defaultHashtags, defaultPostingTimes, ...fields } = input

  return {
    ...fields,
    defaultTagsJson: defaultTags,
    defaultHashtagsJson: defaultHashtags,
    defaultPostingTimesJson: defaultPostingTimes,
  }
}

function toUpdateRecord(input: UpdateDistributionProfileDto) {
  const { defaultTags, defaultHashtags, defaultPostingTimes, ...fields } = input

  return {
    ...fields,
    ...(defaultTags === undefined ? {} : { defaultTagsJson: defaultTags }),
    ...(defaultHashtags === undefined
      ? {}
      : { defaultHashtagsJson: defaultHashtags }),
    ...(defaultPostingTimes === undefined
      ? {}
      : { defaultPostingTimesJson: defaultPostingTimes }),
  }
}

export class DistributionProfilesService {
  static async list(
    params: ListDistributionProfilesRequest & {
      userId: string
      brandId: string
    },
  ) {
    const { items, total } =
      await DistributionProfilesRepository.findPage(params)
    return createPaginatedResponse(items, { ...params, total })
  }

  static async create(
    userId: string,
    brandId: string,
    data: CreateDistributionProfileDto,
  ) {
    const ownsBrand = await DistributionProfilesRepository.brandBelongsToUser({
      brandId,
      userId,
    })

    if (!ownsBrand) throw new DistributionProfileNotFoundError()

    return DistributionProfilesRepository.create({
      brandId,
      status: 'active',
      ...toRecord(data),
    })
  }

  static async update(
    userId: string,
    brandId: string,
    profileId: string,
    data: UpdateDistributionProfileDto,
  ) {
    const updated = await DistributionProfilesRepository.updateForUser({
      id: profileId,
      brandId,
      userId,
      data: toUpdateRecord(data),
    })

    if (!updated) throw new DistributionProfileNotFoundError()
    return updated
  }

  static async archive(userId: string, brandId: string, profileId: string) {
    const archived = await DistributionProfilesRepository.updateForUser({
      id: profileId,
      brandId,
      userId,
      data: { status: 'archived' },
    })

    if (!archived) throw new DistributionProfileNotFoundError()
    return archived
  }
}
