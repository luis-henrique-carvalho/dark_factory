import { DistributionProfileError } from './distribution-profiles.errors'
import { handleApiError } from '#/lib/server/handle-api-error.server'
import type {
  ApiErrorContext,
  ApiErrorResult,
} from '#/lib/server/handle-api-error.server'

function mapDistributionProfileError(
  error: unknown,
): ApiErrorResult | undefined {
  if (error instanceof DistributionProfileError) {
    return {
      status: error.statusCode,
      responseBody: { error: error.message },
    }
  }

  const databaseError =
    error && typeof error === 'object' && 'cause' in error ? error.cause : error

  if (
    databaseError &&
    typeof databaseError === 'object' &&
    'code' in databaseError &&
    databaseError.code === '23505'
  ) {
    return {
      status: 409,
      responseBody: {
        error: 'A profile with this slug already exists for the brand',
      },
    }
  }
}

export function handleDistributionProfileControllerError(
  error: unknown,
  validationMessage: string,
  context: Omit<ApiErrorContext, 'scope'> = {},
) {
  return handleApiError(
    error,
    validationMessage,
    { ...context, scope: 'DISTRIBUTION_PROFILES' },
    mapDistributionProfileError,
  )
}
