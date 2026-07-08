import { z } from 'zod'
import { booleanQueryParam, listQuerySchema } from '#/lib/list-query'
import { userSchema } from '../schemas/user.schema'

export const listUsersRequestSchema = listQuerySchema.extend({
  emailVerified: booleanQueryParam(),
})

export type ListUsersRequest = z.infer<typeof listUsersRequestSchema>

export const paginationMetaSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
})

export const listUsersResponseSchema = z.object({
  items: z.array(userSchema),
  meta: paginationMetaSchema,
})

export type ListUsersResponse = z.infer<typeof listUsersResponseSchema>
