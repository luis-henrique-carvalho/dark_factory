import { ZodError } from 'zod'
import { UserError } from './users.errors'
import { logger } from '#/lib/logger.server'

type UsersControllerErrorContext = {
  request?: Request
  requestBody?: unknown
}

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

export function handleUsersControllerError(
  error: unknown,
  validationMessage: string,
  context: UsersControllerErrorContext = {},
) {
  if (error instanceof Response) {
    return error
  }

  const request = context.request
  const path = request ? new URL(request.url).pathname : undefined
  let status = 500
  let responseBody = { error: 'Internal server error' }

  if (error instanceof ZodError) {
    status = 400
    responseBody = { error: validationMessage }
  } else if (error instanceof SyntaxError) {
    status = 400
    responseBody = { error: 'Invalid JSON body' }
  } else if (error instanceof UserError) {
    status = error.statusCode
    responseBody = { error: error.message }
  } else {
    logger.error('users controller error', { error })
  }

  logger[levelForStatus(status)]('users request failed', {
    scope: 'USERS',
    method: request?.method,
    path,
    status,
    requestBody: context.requestBody,
    responseBody,
    error: errorForLog(error, status),
  })

  return Response.json(responseBody, { status })
}
