import { z } from 'zod'

export const brandStatusSchema = z.enum(['active', 'archived'])

export const brandSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  niche: z.string().min(2, 'Niche must be at least 2 characters'),
  language: z.string().min(2, 'Language must be at least 2 characters'),
  status: brandStatusSchema.default('active'),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()).nullable().optional(),
})

export type Brand = z.infer<typeof brandSchema>
export type BrandStatus = z.infer<typeof brandStatusSchema>

export const createBrandSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  niche: z.string().min(2, 'Niche must be at least 2 characters'),
  language: z.string().min(2, 'Language must be at least 2 characters'),
})

export type CreateBrandInput = z.infer<typeof createBrandSchema>

export const updateBrandSchema = createBrandSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one field must be provided',
  })

export type UpdateBrandInput = z.infer<typeof updateBrandSchema>
