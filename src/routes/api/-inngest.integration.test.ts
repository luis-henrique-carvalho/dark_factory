import { beforeAll, describe, expect, it } from 'vitest'
import { Route } from './inngest'

describe('Inngest API Route (Integration)', () => {
  beforeAll(() => {
    process.env.INNGEST_DEV = '1'
  })

  it('should respond to GET with Inngest config and registered functions info', async () => {
    const handler = Route.options.server?.handlers?.GET
    expect(handler).toBeDefined()

    const request = new Request('http://localhost/api/inngest', {
      method: 'GET',
      headers: {
        host: 'localhost',
      },
    })

    const response = await handler!({ request })
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.mode).toBe('dev')
    expect(data.function_count).toBe(1)
    expect(data.schema_version).toBeDefined()
  })
})


