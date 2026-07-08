import { afterEach, describe, expect, it, vi } from 'vitest'
import { ZodError } from 'zod'
import { handleUsersControllerError } from './users.error-handler'

describe('handleUsersControllerError', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('logs request and response context for handled errors', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const request = new Request('http://localhost/api/v1/users', {
      method: 'POST',
    })
    const requestBody = {
      name: '',
      password: 'secret',
    }

    const response = handleUsersControllerError(
      new ZodError([]),
      'Invalid request body',
      {
        request,
        requestBody,
      },
    )

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ error: 'Invalid request body' })
    expect(warnSpy).toHaveBeenCalledOnce()
    expect(warnSpy.mock.calls[0]?.[0]).toContain('WARN [USERS]')
    expect(warnSpy.mock.calls[0]?.[0]).toContain('method=POST')
    expect(warnSpy.mock.calls[0]?.[0]).toContain('path=/api/v1/users')
    expect(warnSpy.mock.calls[0]?.[0]).toContain(
      'requestBody={"name":"","password":"[REDACTED]"}',
    )
    expect(warnSpy.mock.calls[0]?.[0]).toContain(
      'responseBody={"error":"Invalid request body"}',
    )
    expect(warnSpy.mock.calls[0]?.[0]).not.toContain('stack')
  })
})
