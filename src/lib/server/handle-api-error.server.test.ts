import { afterEach, describe, expect, it, vi } from 'vitest'
import { handleApiError } from './handle-api-error.server'

class ProductError extends Error {
  statusCode = 422

  constructor() {
    super('Product is invalid')
    this.name = 'ProductError'
  }
}

describe('handleApiError', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('maps module-specific errors with explicit logging context', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const request = new Request('http://localhost/api/v1/products', {
      method: 'POST',
    })

    const response = handleApiError(
      new ProductError(),
      'Invalid request body',
      {
        scope: 'PRODUCTS',
        request,
        requestBody: { sku: 'ABC-123' },
      },
      (error) => {
        if (error instanceof ProductError) {
          return {
            status: error.statusCode,
            responseBody: { error: error.message },
          }
        }
      },
    )

    expect(response.status).toBe(422)
    expect(await response.json()).toEqual({ error: 'Product is invalid' })
    expect(warnSpy).toHaveBeenCalledOnce()
    expect(warnSpy.mock.calls[0]?.[0]).toContain('WARN [PRODUCTS]')
    expect(warnSpy.mock.calls[0]?.[0]).toContain('method=POST')
    expect(warnSpy.mock.calls[0]?.[0]).toContain('path=/api/v1/products')
    expect(warnSpy.mock.calls[0]?.[0]).toContain(
      'requestBody={"sku":"ABC-123"}',
    )
    expect(warnSpy.mock.calls[0]?.[0]).toContain(
      'responseBody={"error":"Product is invalid"}',
    )
    expect(warnSpy.mock.calls[0]?.[0]).not.toContain('stack')
  })
})
