import { describe, expect, it } from 'vitest'
import {
  booleanQueryParam,
  createPaginatedResponse,
  createContainsSearchPattern,
  listQuerySchema,
  toLimitOffset,
} from './list-query'

describe('list query helpers', () => {
  it('parses default page, limit, and query', () => {
    expect(listQuerySchema.parse({})).toEqual({
      page: 1,
      limit: 20,
    })

    expect(listQuerySchema.parse({ query: '  ana  ' })).toEqual({
      page: 1,
      limit: 20,
      query: 'ana',
    })

    expect(listQuerySchema.parse({ query: '   ' })).toEqual({
      page: 1,
      limit: 20,
    })
  })

  it('caps limit at 100', () => {
    expect(listQuerySchema.parse({ limit: '101' }).limit).toBe(100)
  })

  it('rejects query values longer than 100 characters', () => {
    expect(() => listQuerySchema.parse({ query: 'a'.repeat(101) })).toThrow()
  })

  it('escapes LIKE wildcards when creating a contains search pattern', () => {
    expect(createContainsSearchPattern('100%_off\\sale')).toBe(
      '%100\\%\\_off\\\\sale%',
    )
  })

  it('parses strict boolean query params', () => {
    const schema = booleanQueryParam()

    expect(schema.parse('true')).toBe(true)
    expect(schema.parse('false')).toBe(false)
    expect(schema.parse('yes')).toBeUndefined()
  })

  it('calculates offset from page and limit', () => {
    expect(toLimitOffset({ page: 3, limit: 20 })).toEqual({
      limit: 20,
      offset: 40,
    })
  })

  it('creates pagination metadata', () => {
    expect(
      createPaginatedResponse(['a'], { page: 2, limit: 20, total: 45 }),
    ).toEqual({
      items: ['a'],
      meta: {
        page: 2,
        limit: 20,
        total: 45,
        totalPages: 3,
        hasNextPage: true,
        hasPreviousPage: true,
      },
    })
  })
})
