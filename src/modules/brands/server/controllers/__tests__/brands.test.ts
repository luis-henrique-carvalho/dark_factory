import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { setupTestDb, cleanDatabase } from '#/test-utils/db-test-helper'
import { UsersRepository } from '#/modules/users/server/repositories/users.repository'
import { BrandsController } from '../brands.controller'

async function createTestUser(emailPrefix = 'brand-owner') {
  return UsersRepository.create({
    name: 'Brand Owner',
    email: `${emailPrefix}-${crypto.randomUUID()}@example.com`,
    emailVerified: true,
  })
}

function createContext(userId: string) {
  return {
    session: {
      user: {
        id: userId,
        name: 'Brand Owner',
        email: 'owner@example.com',
      },
    },
  }
}

describe('Brands API Route (Integration)', () => {
  beforeAll(async () => {
    await setupTestDb()
  })

  beforeEach(async () => {
    await cleanDatabase()
  })

  it('should create a brand for the authenticated user', async () => {
    const owner = await createTestUser()
    const request = new Request('http://localhost/api/v1/brands', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Dark Shorts',
        niche: 'AI history videos',
        language: 'pt-BR',
      }),
    })

    const response = await BrandsController.handleCreate({
      request,
      context: createContext(owner.id),
    })

    expect(response.status).toBe(201)
    const created = await response.json()
    expect(created.id).toBeDefined()
    expect(created.userId).toBe(owner.id)
    expect(created.name).toBe('Dark Shorts')
    expect(created.status).toBe('active')
  })

  it('should list only active brands for the authenticated user by default', async () => {
    const owner = await createTestUser()
    const otherOwner = await createTestUser('other-owner')
    const context = createContext(owner.id)

    const activeResponse = await BrandsController.handleCreate({
      request: new Request('http://localhost/api/v1/brands', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Active Brand',
          niche: 'Education',
          language: 'en-US',
        }),
      }),
      context,
    })
    const activeBrand = await activeResponse.json()

    await BrandsController.handleCreate({
      request: new Request('http://localhost/api/v1/brands', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Other Brand',
          niche: 'Gaming',
          language: 'en-US',
        }),
      }),
      context: createContext(otherOwner.id),
    })

    await BrandsController.handleArchive({
      params: { brandId: activeBrand.id },
      context,
    })

    await BrandsController.handleCreate({
      request: new Request('http://localhost/api/v1/brands', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Second Active Brand',
          niche: 'Finance',
          language: 'pt-BR',
        }),
      }),
      context,
    })

    const response = await BrandsController.handleList({
      request: new Request('http://localhost/api/v1/brands'),
      context,
    })

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.items).toHaveLength(1)
    expect(data.items[0].name).toBe('Second Active Brand')
  })

  it('should list archived brands when status filter is archived', async () => {
    const owner = await createTestUser()
    const context = createContext(owner.id)
    const createResponse = await BrandsController.handleCreate({
      request: new Request('http://localhost/api/v1/brands', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Archived Brand',
          niche: 'Documentaries',
          language: 'pt-BR',
        }),
      }),
      context,
    })
    const created = await createResponse.json()
    await BrandsController.handleArchive({
      params: { brandId: created.id },
      context,
    })

    const response = await BrandsController.handleList({
      request: new Request('http://localhost/api/v1/brands?status=archived'),
      context,
    })

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.items).toHaveLength(1)
    expect(data.items[0].status).toBe('archived')
  })

  it('should filter brands by search query within the selected status', async () => {
    const owner = await createTestUser()
    const context = createContext(owner.id)

    await BrandsController.handleCreate({
      request: new Request('http://localhost/api/v1/brands', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Dark Shorts',
          niche: 'AI documentaries',
          language: 'pt-BR',
        }),
      }),
      context,
    })
    await BrandsController.handleCreate({
      request: new Request('http://localhost/api/v1/brands', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Finance Desk',
          niche: 'Markets',
          language: 'en-US',
        }),
      }),
      context,
    })

    const response = await BrandsController.handleList({
      request: new Request('http://localhost/api/v1/brands?query=document'),
      context,
    })

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.items).toHaveLength(1)
    expect(data.items[0].name).toBe('Dark Shorts')
  })

  it('should update an owned brand', async () => {
    const owner = await createTestUser()
    const context = createContext(owner.id)
    const createResponse = await BrandsController.handleCreate({
      request: new Request('http://localhost/api/v1/brands', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Original Brand',
          niche: 'Original niche',
          language: 'en-US',
        }),
      }),
      context,
    })
    const created = await createResponse.json()

    const response = await BrandsController.handleUpdate({
      request: new Request(`http://localhost/api/v1/brands/${created.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: 'Updated Brand',
          niche: 'Updated niche',
          language: 'pt-BR',
        }),
      }),
      params: { brandId: created.id },
      context,
    })

    expect(response.status).toBe(200)
    const updated = await response.json()
    expect(updated.name).toBe('Updated Brand')
    expect(updated.niche).toBe('Updated niche')
    expect(updated.language).toBe('pt-BR')
  })

  it('should archive an owned brand', async () => {
    const owner = await createTestUser()
    const context = createContext(owner.id)
    const createResponse = await BrandsController.handleCreate({
      request: new Request('http://localhost/api/v1/brands', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Brand to Archive',
          niche: 'News',
          language: 'en-US',
        }),
      }),
      context,
    })
    const created = await createResponse.json()

    const response = await BrandsController.handleArchive({
      params: { brandId: created.id },
      context,
    })

    expect(response.status).toBe(200)
    const archived = await response.json()
    expect(archived.status).toBe('archived')
  })
})
