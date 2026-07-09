import { z } from 'zod'

export const createBrandDto = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  niche: z.string().min(2, 'Niche must be at least 2 characters'),
  language: z.string().min(2, 'Language must be at least 2 characters'),
})

export type CreateBrandDto = z.infer<typeof createBrandDto>

export const updateBrandDto = createBrandDto
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one field must be provided',
  })

export type UpdateBrandDto = z.infer<typeof updateBrandDto>
