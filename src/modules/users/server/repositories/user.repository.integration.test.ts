import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { UsersRepository } from './users.repository'
import { setupTestDb, cleanDatabase } from '@/test-utils/db-test-helper'

describe('UsersRepository (Integration)', () => {
  beforeAll(async () => {
    await setupTestDb()
  })

  beforeEach(async () => {
    await cleanDatabase()
  })

  describe('create', () => {
    it('should create a user successfully with a generated UUID', async () => {
      const email = `test-${crypto.randomUUID()}@example.com`
      const created = await UsersRepository.create({
        name: 'John Doe',
        email,
        emailVerified: true,
      })

      expect(created.id).toBeDefined()
      expect(created.name).toBe('John Doe')
      expect(created.email).toBe(email)
      expect(created.emailVerified).toBe(true)
    })

    it('should throw a unique constraint error when inserting a duplicate email', async () => {
      const email = `duplicate-${crypto.randomUUID()}@example.com`
      await UsersRepository.create({
        name: 'User One',
        email,
        emailVerified: false,
      })

      // Inserting second user with same email must throw
      await expect(
        UsersRepository.create({
          name: 'User Two',
          email,
          emailVerified: false,
        }),
      ).rejects.toThrow()
    })

    it('should throw a database constraint error when inserting a null name', async () => {
      await expect(
        UsersRepository.create({
          name: null as unknown as string,
          email: `null-name-${crypto.randomUUID()}@example.com`,
          emailVerified: false,
        }),
      ).rejects.toThrow()
    })
  })

  describe('findById', () => {
    it('should return the user if found by ID', async () => {
      const created = await UsersRepository.create({
        name: 'Jane Doe',
        email: `test-${crypto.randomUUID()}@example.com`,
        emailVerified: false,
      })

      const found = await UsersRepository.findById(created.id)
      expect(found).not.toBeNull()
      expect(found?.id).toBe(created.id)
    })

    it('should return null if the user is not found by ID', async () => {
      const found = await UsersRepository.findById('non-existent-id')
      expect(found).toBeNull()
    })
  })

  describe('findByEmail', () => {
    it('should return the user if found by email', async () => {
      const email = `test-${crypto.randomUUID()}@example.com`
      const created = await UsersRepository.create({
        name: 'Jane Doe',
        email,
        emailVerified: false,
      })

      const found = await UsersRepository.findByEmail(email)
      expect(found).not.toBeNull()
      expect(found?.id).toBe(created.id)
    })

    it('should return null if the user is not found by email', async () => {
      const found = await UsersRepository.findByEmail('nonexistent@example.com')
      expect(found).toBeNull()
    })
  })

  describe('update', () => {
    it('should update user fields successfully', async () => {
      const created = await UsersRepository.create({
        name: 'Original Name',
        email: `test-${crypto.randomUUID()}@example.com`,
        emailVerified: false,
      })

      const updated = await UsersRepository.update(created.id, {
        name: 'Updated Name',
        emailVerified: true,
      })

      expect(updated).not.toBeNull()
      expect(updated?.name).toBe('Updated Name')
      expect(updated?.emailVerified).toBe(true)

      // Verify db changes
      const found = await UsersRepository.findById(created.id)
      expect(found?.name).toBe('Updated Name')
    })

    it('should return null when attempting to update a non-existent user', async () => {
      const updated = await UsersRepository.update('non-existent-id', {
        name: 'New Name',
      })
      expect(updated).toBeNull()
    })
  })

  describe('delete', () => {
    it('should delete a user successfully', async () => {
      const created = await UsersRepository.create({
        name: 'To Delete',
        email: `test-${crypto.randomUUID()}@example.com`,
        emailVerified: false,
      })

      const deleted = await UsersRepository.delete(created.id)
      expect(deleted).not.toBeNull()
      expect(deleted?.id).toBe(created.id)

      const found = await UsersRepository.findById(created.id)
      expect(found).toBeNull()
    })

    it('should return null when attempting to delete a non-existent user', async () => {
      const deleted = await UsersRepository.delete('non-existent-id')
      expect(deleted).toBeNull()
    })
  })

  describe('findPage', () => {
    it('should paginate and filter results correctly', async () => {
      // Create test users
      await UsersRepository.create({
        name: 'Alice Smith',
        email: `alice-${crypto.randomUUID()}@example.com`,
        emailVerified: true,
      })
      await UsersRepository.create({
        name: 'Bob Jones',
        email: `bob-${crypto.randomUUID()}@example.com`,
        emailVerified: false,
      })
      await UsersRepository.create({
        name: 'Charlie Smith',
        email: `charlie-${crypto.randomUUID()}@example.com`,
        emailVerified: true,
      })

      // Query pagination
      const page1 = await UsersRepository.findPage({ page: 1, limit: 2 })
      expect(page1.items).toHaveLength(2)
      expect(page1.total).toBe(3)

      // Query with query filter
      const filterPage = await UsersRepository.findPage({
        page: 1,
        limit: 10,
        query: 'smith',
      })
      expect(filterPage.items).toHaveLength(2)
      expect(filterPage.total).toBe(2)
      expect(
        filterPage.items.every((u) => u.name.toLowerCase().includes('smith')),
      ).toBe(true)

      // Query with verified filter
      const verifiedPage = await UsersRepository.findPage({
        page: 1,
        limit: 10,
        emailVerified: true,
      })
      expect(verifiedPage.items).toHaveLength(2)
      expect(verifiedPage.total).toBe(2)
      expect(verifiedPage.items.every((u) => u.emailVerified)).toBe(true)
    })
  })
})
