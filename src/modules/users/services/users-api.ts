import type {
  User,
  ListUsersResponse,
  CreateUserForm,
  UpdateUserForm,
} from '../schemas/users.schema'

export const UsersApi = {
  async list(): Promise<ListUsersResponse> {
    const response = await fetch('/api/v1/users')
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || 'Failed to list users')
    }
    return response.json()
  },

  async create(data: CreateUserForm): Promise<User> {
    const response = await fetch('/api/v1/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || 'Failed to create user')
    }
    return response.json()
  },

  async update(id: string, data: UpdateUserForm): Promise<User> {
    const response = await fetch(`/api/v1/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || 'Failed to update user')
    }
    return response.json()
  },

  async delete(id: string): Promise<User> {
    const response = await fetch(`/api/v1/users/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || 'Failed to delete user')
    }
    return response.json()
  },
}
