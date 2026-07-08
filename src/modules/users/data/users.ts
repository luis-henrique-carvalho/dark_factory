import type { User } from './schema'

export const mockUsers: User[] = [
  {
    id: 'user_1',
    name: 'Luis Henrique',
    email: 'luis@example.com',
    emailVerified: true,
    status: 'active',
    role: 'admin',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-07-01'),
  },
  {
    id: 'user_2',
    name: 'Ana Maria',
    email: 'ana@example.com',
    emailVerified: false,
    status: 'invited',
    role: 'user',
    createdAt: new Date('2026-05-15'),
  },
  {
    id: 'user_3',
    name: 'Carlos Alberto',
    email: 'carlos@example.com',
    emailVerified: true,
    status: 'inactive',
    role: 'user',
    createdAt: new Date('2026-03-20'),
    updatedAt: new Date('2026-04-10'),
  },
]
