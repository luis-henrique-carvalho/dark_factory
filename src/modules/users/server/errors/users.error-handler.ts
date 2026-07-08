import { ZodError } from 'zod'
import { UserError } from './users.errors'
import { logger } from '#/lib/logger.server'

export function handleUsersControllerError(
  error: unknown,
  validationMessage: string,
) {
  if (error instanceof Response) {
    return error
  }

  if (error instanceof ZodError) {
    return Response.json({ error: validationMessage }, { status: 400 })
  }

  if (error instanceof SyntaxError) {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (error instanceof UserError) {
    return Response.json(
      { error: error.message },
      { status: error.statusCode },
    )
  }

  logger.error('users controller error', { error })
  return Response.json({ error: 'Internal server error' }, { status: 500 })
}
