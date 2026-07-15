import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { setupTestDb, cleanDatabase } from '#/test-utils/db-test-helper'
import { BrandsController } from '#/modules/brands/server'
import { UsersRepository } from '#/modules/users/server/repositories/users.repository'
import { DistributionProfilesController } from '../distribution-profiles.controller'

async function createTestUser(emailPrefix = 'profile-owner') {
  return UsersRepository.create({
    name: 'Profile Owner',
    email: `${emailPrefix}-${crypto.randomUUID()}@example.com`,
    emailVerified: true,
  })
}

function createContext(userId: string) {
  return { session: { user: { id: userId } } }
}

async function createBrand(userId: string) {
  const response = await BrandsController.handleCreate({
    request: new Request('http://localhost/api/v1/brands', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Distribution Brand',
        niche: 'Education',
        language: 'pt-BR',
      }),
    }),
    context: createContext(userId),
  })

  return response.json() as Promise<{ id: string }>
}

function profileBody(
  _brandId: string,
  overrides: Record<string, unknown> = {},
) {
  return {
    slug: 'youtube-short',
    platform: 'youtube',
    contentFormat: 'short',
    resolutionWidth: 1080,
    resolutionHeight: 1920,
    aspectRatio: '9:16',
    minDurationSeconds: 15,
    targetDurationSeconds: 45,
    maxDurationSeconds: 60,
    timezone: 'America/Bahia',
    defaultTitleTemplate: '{{title}}',
    defaultDescriptionTemplate: '{{description}}',
    defaultTags: ['education'],
    defaultHashtags: ['#shorts'],
    defaultPostingTimes: [{ day: 'monday', time: '12:00' }],
    ...overrides,
  }
}

describe('Distribution Profiles API (Integration)', () => {
  beforeAll(async () => {
    await setupTestDb()
  })

  beforeEach(async () => {
    await cleanDatabase()
  })

  it('should create a profile for an owned brand', async () => {
    const owner = await createTestUser()
    const brand = await createBrand(owner.id)

    const response = await DistributionProfilesController.handleCreate({
      request: new Request('http://localhost/api/v1/distribution-profiles', {
        method: 'POST',
        body: JSON.stringify(profileBody(brand.id)),
      }),
      params: { brandId: brand.id },
      context: createContext(owner.id),
    })

    expect(response.status).toBe(201)
    const created = await response.json()
    expect(created.brandId).toBe(brand.id)
    expect(created.platform).toBe('youtube')
    expect(created.contentFormat).toBe('short')
    expect(created.status).toBe('active')
    expect(created.defaultTagsJson).toEqual(['education'])
  })

  it('should reject invalid duration ordering', async () => {
    const owner = await createTestUser()
    const brand = await createBrand(owner.id)

    const response = await DistributionProfilesController.handleCreate({
      request: new Request('http://localhost/api/v1/distribution-profiles', {
        method: 'POST',
        body: JSON.stringify(
          profileBody(brand.id, { targetDurationSeconds: 90 }),
        ),
      }),
      params: { brandId: brand.id },
      context: createContext(owner.id),
    })

    expect(response.status).toBe(400)
  })

  it('should reject a profile for a brand owned by another user', async () => {
    const owner = await createTestUser()
    const otherUser = await createTestUser('other-profile-owner')
    const brand = await createBrand(owner.id)

    const response = await DistributionProfilesController.handleCreate({
      request: new Request('http://localhost/api/v1/distribution-profiles', {
        method: 'POST',
        body: JSON.stringify(profileBody(brand.id)),
      }),
      params: { brandId: brand.id },
      context: createContext(otherUser.id),
    })

    expect(response.status).toBe(404)
  })

  it('should reject duplicate slugs within the same brand', async () => {
    const owner = await createTestUser()
    const brand = await createBrand(owner.id)
    const context = createContext(owner.id)

    await DistributionProfilesController.handleCreate({
      request: new Request('http://localhost/api/v1/distribution-profiles', {
        method: 'POST',
        body: JSON.stringify(profileBody(brand.id)),
      }),
      params: { brandId: brand.id },
      context,
    })

    const response = await DistributionProfilesController.handleCreate({
      request: new Request('http://localhost/api/v1/distribution-profiles', {
        method: 'POST',
        body: JSON.stringify(profileBody(brand.id)),
      }),
      params: { brandId: brand.id },
      context,
    })

    expect(response.status).toBe(409)
  })

  it('should list active and archived profiles by status', async () => {
    const owner = await createTestUser()
    const brand = await createBrand(owner.id)
    const context = createContext(owner.id)
    const createResponse = await DistributionProfilesController.handleCreate({
      request: new Request('http://localhost/api/v1/distribution-profiles', {
        method: 'POST',
        body: JSON.stringify(profileBody(brand.id)),
      }),
      params: { brandId: brand.id },
      context,
    })
    const profile = await createResponse.json()

    await DistributionProfilesController.handleArchive({
      params: { brandId: brand.id, distributionProfileId: profile.id },
      context,
    })

    const response = await DistributionProfilesController.handleList({
      request: new Request(
        'http://localhost/api/v1/brands/brand-1/distribution-profiles?status=archived',
      ),
      params: { brandId: brand.id },
      context,
    })

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.items).toHaveLength(1)
    expect(data.items[0].status).toBe('archived')
  })
})
