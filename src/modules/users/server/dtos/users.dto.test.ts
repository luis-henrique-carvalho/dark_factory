import { describe, expect, it } from 'vitest'
import { createUserDto, updateUserDto } from './users.dto'

describe('users DTOs', () => {
  it('validates create user payloads', () => {
    expect(
      createUserDto.parse({
        name: 'Ana Maria',
        email: 'ana@example.com',
      }),
    ).toEqual({
      name: 'Ana Maria',
      email: 'ana@example.com',
    })
  })

  it('rejects empty update payloads', () => {
    expect(() => updateUserDto.parse({})).toThrow()
  })
})
