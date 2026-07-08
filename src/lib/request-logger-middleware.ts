import { createMiddleware } from '@tanstack/react-start'
import { logger } from './logger.server'

function levelForStatus(status: number) {
  if (status >= 500) return 'error'
  if (status >= 400) return 'warn'
  return 'info'
}

function messageForStatus(status: number) {
  if (status >= 400) return 'request failed'
  return 'request completed'
}

export const requestLoggerMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const startTime = Date.now()
    const url = new URL(request.url)

    try {
      const result = await next()
      const durationMs = Date.now() - startTime

      logger[levelForStatus(result.response.status)](
        messageForStatus(result.response.status),
        {
        method: request.method,
        path: url.pathname,
        status: result.response.status,
        durationMs,
        },
      )

      return result
    } catch (error) {
      const durationMs = Date.now() - startTime

      if (error instanceof Response) {
        logger[levelForStatus(error.status)](messageForStatus(error.status), {
          method: request.method,
          path: url.pathname,
          status: error.status,
          durationMs,
        })

        throw error
      }

      logger.error('request failed', {
        method: request.method,
        path: url.pathname,
        durationMs,
        error,
      })

      throw error
    }
  },
)
