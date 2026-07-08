import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { UsersController } from './users.controller'
import { setupTestDb, cleanDatabase } from '@/test-utils/db-test-helper'
import { UsersRepository } from '../repositories/users.repository'

describe('Users API Route (Integration)', () => {
  beforeAll(async () => {
    await setupTestDb()
  })

  beforeEach(async () => {
    await cleanDatabase()
  })

  describe('handleCreate', () => {
    it('should create a user successfully and return 201', async () => {
      const email = `api-test-${crypto.randomUUID()}@test.com`
      const request = new Request('http://localhost/api/v1/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'API Test User',
          email,
          emailVerified: true,
        }),
      })

      const response = await UsersController.handleCreate({ request })
      expect(response.status).toBe(201)

      const createdUser = await response.json()
      expect(createdUser.id).toBeDefined()
      expect(createdUser.name).toBe('API Test User')
      expect(createdUser.email).toBe(email)
    })

    it('should return 400 when request body input is invalid', async () => {
      const request = new Request('http://localhost/api/v1/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: '', // Empty name triggers Zod validation error
          email: 'invalid-email',
        }),
      })

      const response = await UsersController.handleCreate({ request })
      expect(response.status).toBe(400)

      const errorBody = await response.json()
      expect(errorBody.error).toBe('Invalid request body')
    })

    it('should return 409 when the email is already registered', async () => {
      const email = `duplicate-${crypto.randomUUID()}@test.com`
      await UsersRepository.create({
        name: 'Existing User',
        email,
        emailVerified: false,
      })

      const request = new Request('http://localhost/api/v1/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Another User',
          email,
          emailVerified: false,
        }),
      })

      const response = await UsersController.handleCreate({ request })
      expect(response.status).toBe(409)

      const errorBody = await response.json()
      expect(errorBody.error).toBe('Email already registered')
    })
  })

  describe('handleList', () => {
    it('should return a paginated list of users', async () => {
      // Seed data
      await UsersRepository.create({
        name: 'User 1',
        email: `user1-${crypto.randomUUID()}@example.com`,
        emailVerified: true,
      })
      await UsersRepository.create({
        name: 'User 2',
        email: `user2-${crypto.randomUUID()}@example.com`,
        emailVerified: false,
      })

      const request = new Request('http://localhost/api/v1/users?page=1&limit=10')
      const response = await UsersController.handleList({ request })
      expect(response.status).toBe(200)

      const data = await response.json()
      expect(data.meta.total).toBe(2)
      expect(data.items).toHaveLength(2)
    })
  })

  describe('handleDetail', () => {
    it('should return user details when the user exists', async () => {
      const created = await UsersRepository.create({
        name: 'Detail User',
        email: `detail-${crypto.randomUUID()}@example.com`,
        emailVerified: true,
      })

      const response = await UsersController.handleDetail({
        params: { userId: created.id },
      })
      expect(response.status).toBe(200)

      const user = await response.json()
      expect(user.id).toBe(created.id)
      expect(user.name).toBe('Detail User')
    })

    it('should return 404 when the user is not found by ID', async () => {
      const response = await UsersController.handleDetail({
        params: { userId: 'non-existent-id' },
      })
      expect(response.status).toBe(404)

      const data = await response.json()
      expect(data.error).toBe('User not found')
    })
  })

  describe('handleUpdate', () => {
    it('should update user fields successfully and return 200', async () => {
      const created = await UsersRepository.create({
        name: 'Original User',
        email: `original-${crypto.randomUUID()}@test.com`,
        emailVerified: false,
      })

      const request = new Request(`http://localhost/api/v1/users/${created.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Updated User Name',
        }),
      })

      const response = await UsersController.handleUpdate({
        request,
        params: { userId: created.id },
      })
      expect(response.status).toBe(200)

      const updatedUser = await response.json()
      expect(updatedUser.name).toBe('Updated User Name')
      expect(updatedUser.emailVerified).toBe(false)
    })

    it('should return 404 when attempting to update a non-existent user', async () => {
      const request = new Request('http://localhost/api/v1/users/non-existent-id', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'New Name',
        }),
      })

      const response = await UsersController.handleUpdate({
        request,
        params: { userId: 'non-existent-id' },
      })
      expect(response.status).toBe(404)

      const errorBody = await response.json()
      expect(errorBody.error).toBe('User not found')
    })

    it('should return 409 when updating email to one already registered by another user', async () => {
      const emailInUse = `inuse-${crypto.randomUUID()}@test.com`
      await UsersRepository.create({
        name: 'User One',
        email: emailInUse,
        emailVerified: false,
      })

      const userTwo = await UsersRepository.create({
        name: 'User Two',
        email: `usertwo-${crypto.randomUUID()}@test.com`,
        emailVerified: false,
      })

      const request = new Request(`http://localhost/api/v1/users/${userTwo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailInUse,
        }),
      })

      const response = await UsersController.handleUpdate({
        request,
        params: { userId: userTwo.id },
      })
      expect(response.status).toBe(409)

      const errorBody = await response.json()
      expect(errorBody.error).toBe('Email already registered')
    })
  })

  describe('handleDelete', () => {
    it('should delete a user successfully and return 200', async () => {
      const created = await UsersRepository.create({
        name: 'To Delete',
        email: `todelete-${crypto.randomUUID()}@test.com`,
        emailVerified: false,
      })

      const response = await UsersController.handleDelete({
        params: { userId: created.id },
      })
      expect(response.status).toBe(200)

      const deletedUser = await response.json()
      expect(deletedUser.id).toBe(created.id)

      const found = await UsersRepository.findById(created.id)
      expect(found).toBeNull()
    })

    it('should return 404 when attempting to delete a non-existent user', async () => {
      const response = await UsersController.handleDelete({
        params: { userId: 'non-existent-id' },
      })
      expect(response.status).toBe(404)

      const errorBody = await response.json()
      expect(errorBody.error).toBe('User not found')
    })
  })
})
