import { z } from 'zod'

// Domain Schema
export const userSchema = z.object({
  id: z.string(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  emailVerified: z.boolean().default(false),
  image: z.string().nullable().optional(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()).nullable().optional(),
})

export type User = z.infer<typeof userSchema>

// Form Validation Schemas
export const createUserFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
})

export type CreateUserForm = z.infer<typeof createUserFormSchema>

export const updateUserFormSchema = createUserFormSchema.partial()

export type UpdateUserForm = z.infer<typeof updateUserFormSchema>

// API Request/Response Validation Schemas
export const listUsersResponseSchema = z.object({
  users: z.array(userSchema),
  total: z.number(),
})

export type ListUsersResponse = z.infer<typeof listUsersResponseSchema>
