import { z } from 'zod'

export type ListQuery = z.infer<typeof listQuerySchema>

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 20
const MAX_LIMIT = 100
export const MAX_QUERY_LENGTH = 100

function optionalTrimmedString(value: unknown) {
  if (typeof value !== 'string') return undefined

  const trimmed = value.trim()
  return trimmed === '' ? undefined : trimmed
}

function paginationNumber({
  defaultValue,
  min,
  max,
}: {
  defaultValue: number
  min: number
  max?: number
}) {
  return z.preprocess(
    (value) => {
      const parsed =
        typeof value === 'number'
          ? value
          : typeof value === 'string' && value.trim() !== ''
            ? Number(value)
            : Number.NaN

      if (!Number.isInteger(parsed)) return defaultValue
      if (parsed < min) return defaultValue
      if (max !== undefined && parsed > max) return max

      return parsed
    },
    z
      .number()
      .int()
      .min(min)
      .max(max ?? Number.MAX_SAFE_INTEGER),
  )
}

export function booleanQueryParam() {
  return z.preprocess((value) => {
    if (value === undefined || value === null || value === '') return undefined
    if (value === true || value === false) return value
    if (value === 'true') return true
    if (value === 'false') return false

    return undefined
  }, z.boolean().optional())
}

export const listQuerySchema = z.object({
  page: paginationNumber({ defaultValue: DEFAULT_PAGE, min: 1 }),
  limit: paginationNumber({
    defaultValue: DEFAULT_LIMIT,
    min: 1,
    max: MAX_LIMIT,
  }),
  query: z.preprocess(
    optionalTrimmedString,
    z.string().max(MAX_QUERY_LENGTH).optional(),
  ),
})

export function escapeLikePattern(value: string) {
  return value.replace(/[\\%_]/g, '\\$&')
}

export function createContainsSearchPattern(value: string) {
  return `%${escapeLikePattern(value)}%`
}

export type LimitOffset = {
  limit: number
  offset: number
}

export function toLimitOffset({
  page,
  limit,
}: {
  page: number
  limit: number
}): LimitOffset {
  return {
    limit,
    offset: (page - 1) * limit,
  }
}

export type PaginatedResponse<T> = {
  items: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

export function createPaginatedResponse<T>(
  items: T[],
  {
    page,
    limit,
    total,
  }: {
    page: number
    limit: number
    total: number
  },
): PaginatedResponse<T> {
  const totalPages = Math.ceil(total / limit)

  return {
    items,
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  }
}
