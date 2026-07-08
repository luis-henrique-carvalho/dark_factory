import { UsersRepository } from './users.repository'
import { EmailAlreadyExistsError, UserNotFoundError } from './users.errors'
import { createPaginatedResponse } from '#/lib/server/list-query'
import type { ListUsersRequest } from '../contracts'

export class UsersService {
  static async list(params: ListUsersRequest) {
    const { items, total } = await UsersRepository.findPage(params)

    return createPaginatedResponse(items, { ...params, total })
  }

  static async getById(id: string) {
    const user = await UsersRepository.findById(id)
    if (!user) throw new UserNotFoundError()
    return user
  }

  static async create(data: { name: string; email: string }) {
    const existing = await UsersRepository.findByEmail(data.email)

    if (existing) throw new EmailAlreadyExistsError()

    return await UsersRepository.create({
      name: data.name,
      email: data.email,
      emailVerified: false,
    })
  }

  static async update(id: string, data: { name?: string; email?: string }) {
    const user = await UsersRepository.findById(id)
    if (!user) throw new UserNotFoundError()

    if (data.email && data.email !== user.email) {
      const existing = await UsersRepository.findByEmail(data.email)
      if (existing) throw new EmailAlreadyExistsError()
    }

    const updated = await UsersRepository.update(id, data)
    if (!updated) throw new UserNotFoundError()
    return updated
  }

  static async delete(id: string) {
    const deleted = await UsersRepository.delete(id)
    if (!deleted) throw new UserNotFoundError()
    return deleted
  }
}
