import { z } from 'zod'
import { listQuerySchema } from '#/lib/query/list-query'
import { brandSchema, brandStatusSchema } from '../schemas/brand.schema'

export const listBrandsRequestSchema = listQuerySchema.extend({
  status: brandStatusSchema.default('active').optional(),
})

export type ListBrandsRequest = z.infer<typeof listBrandsRequestSchema>

export const paginationMetaSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
})

export const listBrandsResponseSchema = z.object({
  items: z.array(brandSchema),
  meta: paginationMetaSchema,
})

export type ListBrandsResponse = z.infer<typeof listBrandsResponseSchema>
