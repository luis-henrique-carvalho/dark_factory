import { describe, expect, it } from 'vitest'
import { createUserDto, updateUserDto } from './users.dto'

describe('users DTOs', () => {
  it('should validate create user payloads', () => {
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

  it('should reject empty update payloads', () => {
    expect(() => updateUserDto.parse({})).toThrow()
  })
})
