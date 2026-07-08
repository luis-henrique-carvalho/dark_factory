import { z } from 'zod'

export const createUserDto = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
})

export type CreateUserDto = z.infer<typeof createUserDto>

export const updateUserDto = createUserDto
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one field must be provided',
  })

export type UpdateUserDto = z.infer<typeof updateUserDto>
