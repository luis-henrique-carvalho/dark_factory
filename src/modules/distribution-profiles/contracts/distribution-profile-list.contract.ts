import { z } from 'zod'
import { listQuerySchema } from '#/lib/query/list-query'
import {
  distributionProfileSchema,
  distributionProfileStatusSchema,
} from '../schemas'

export const listDistributionProfilesRequestSchema = listQuerySchema.extend({
  status: distributionProfileStatusSchema.default('active').optional(),
})

export const paginationMetaSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
})

export const listDistributionProfilesResponseSchema = z.object({
  items: z.array(distributionProfileSchema),
  meta: paginationMetaSchema,
})

export type ListDistributionProfilesRequest = z.infer<
  typeof listDistributionProfilesRequestSchema
>
export type ListDistributionProfilesResponse = z.infer<
  typeof listDistributionProfilesResponseSchema
>
