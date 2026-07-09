import { BrandError } from './brands.errors'
import { handleApiError } from '#/lib/server/handle-api-error.server'
import type {
  ApiErrorContext,
  ApiErrorResult,
} from '#/lib/server/handle-api-error.server'

function mapBrandsError(error: unknown): ApiErrorResult | undefined {
  if (error instanceof BrandError) {
    return {
      status: error.statusCode,
      responseBody: { error: error.message },
    }
  }
}

export function handleBrandsControllerError(
  error: unknown,
  validationMessage: string,
  context: Omit<ApiErrorContext, 'scope'> = {},
) {
  return handleApiError(
    error,
    validationMessage,
    {
      ...context,
      scope: 'BRANDS',
    },
    mapBrandsError,
  )
}
