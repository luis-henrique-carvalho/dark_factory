import { UserError } from './users.errors'
import { handleApiError } from '#/lib/handle-api-error.server'
import type {
  ApiErrorContext,
  ApiErrorResult,
} from '#/lib/handle-api-error.server'

function mapUsersError(error: unknown): ApiErrorResult | undefined {
  if (error instanceof UserError) {
    return {
      status: error.statusCode,
      responseBody: { error: error.message },
    }
  }
}

export function handleUsersControllerError(
  error: unknown,
  validationMessage: string,
  context: Omit<ApiErrorContext, 'scope'> = {},
) {
  return handleApiError(
    error,
    validationMessage,
    {
      ...context,
      scope: 'USERS',
    },
    mapUsersError,
  )
}
