import { ZodError } from 'zod'
import { logger } from './logger.server'

export type ApiErrorContext = {
  scope: string
  request?: Request
  requestBody?: unknown
}

export type ApiErrorResult = {
  status: number
  responseBody: {
    error: string
  }
}

type MapApiError = (error: unknown) => ApiErrorResult | undefined

function levelForStatus(status: number) {
  if (status >= 500) return 'error'
  if (status >= 400) return 'warn'
  return 'info'
}

function errorForLog(error: unknown, status: number) {
  if (status >= 500) return error

  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
    }
  }

  return error
}

export function handleApiError(
  error: unknown,
  validationMessage: string,
  context: ApiErrorContext,
  mapApiError?: MapApiError,
) {
  if (error instanceof Response) {
    return error
  }

  const request = context.request
  const path = request ? new URL(request.url).pathname : undefined
  const mappedError = mapApiError?.(error)
  let status = mappedError?.status ?? 500
  let responseBody = mappedError?.responseBody ?? {
    error: 'Internal server error',
  }

  if (error instanceof ZodError) {
    status = 400
    responseBody = { error: validationMessage }
  } else if (error instanceof SyntaxError) {
    status = 400
    responseBody = { error: 'Invalid JSON body' }
  } else if (!mappedError) {
    logger.error(`${context.scope.toLowerCase()} controller error`, { error })
  }

  logger[levelForStatus(status)](`${context.scope.toLowerCase()} request failed`, {
    scope: context.scope,
    method: request?.method,
    path,
    status,
    requestBody: context.requestBody,
    responseBody,
    error: errorForLog(error, status),
  })

  return Response.json(responseBody, { status })
}
