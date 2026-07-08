import { z } from 'zod'

export const createUserFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
})

export type CreateUserForm = z.infer<typeof createUserFormSchema>

export const updateUserFormSchema = createUserFormSchema.partial()

export type UpdateUserForm = z.infer<typeof updateUserFormSchema>
