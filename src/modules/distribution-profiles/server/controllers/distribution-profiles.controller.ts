import { listDistributionProfilesRequestSchema } from '../../contracts'
import {
  createDistributionProfileDto,
  updateDistributionProfileDto,
} from '../dtos/distribution-profiles.dto'
import { handleDistributionProfileControllerError } from '../errors/distribution-profiles.error-handler'
import { DistributionProfilesPolicy } from '../policies/distribution-profiles.policy'
import { DistributionProfilesService } from '../services/distribution-profiles.service'

type DistributionProfilesAuthContext = {
  session: { user: { id: string } }
}

export const DistributionProfilesController = {
  async handleList({
    request,
    params: routeParams,
    context,
  }: {
    request: Request
    params: { brandId: string }
    context: DistributionProfilesAuthContext
  }) {
    try {
      if (!(await DistributionProfilesPolicy.canManage())) {
        return Response.json({ error: 'Forbidden' }, { status: 403 })
      }

      const queryParams = listDistributionProfilesRequestSchema.parse(
        Object.fromEntries(new URL(request.url).searchParams),
      )
      const response = await DistributionProfilesService.list({
        userId: context.session.user.id,
        brandId: routeParams.brandId,
        ...queryParams,
      })
      return Response.json(response)
    } catch (error) {
      return handleDistributionProfileControllerError(
        error,
        'Invalid query params',
        { request },
      )
    }
  },

  async handleCreate({
    request,
    params: routeParams,
    context,
  }: {
    request: Request
    params: { brandId: string }
    context: DistributionProfilesAuthContext
  }) {
    let requestBody: unknown
    try {
      if (!(await DistributionProfilesPolicy.canManage())) {
        return Response.json({ error: 'Forbidden' }, { status: 403 })
      }

      requestBody = await request.json()
      const input = createDistributionProfileDto.parse(requestBody)
      const created = await DistributionProfilesService.create(
        context.session.user.id,
        routeParams.brandId,
        input,
      )
      return Response.json(created, { status: 201 })
    } catch (error) {
      return handleDistributionProfileControllerError(
        error,
        'Invalid request body',
        { request, requestBody },
      )
    }
  },

  async handleUpdate({
    request,
    params,
    context,
  }: {
    request: Request
    params: { brandId: string; distributionProfileId: string }
    context: DistributionProfilesAuthContext
  }) {
    let requestBody: unknown
    try {
      if (!(await DistributionProfilesPolicy.canManage())) {
        return Response.json({ error: 'Forbidden' }, { status: 403 })
      }

      requestBody = await request.json()
      const input = updateDistributionProfileDto.parse(requestBody)
      const updated = await DistributionProfilesService.update(
        context.session.user.id,
        params.brandId,
        params.distributionProfileId,
        input,
      )
      return Response.json(updated)
    } catch (error) {
      return handleDistributionProfileControllerError(
        error,
        'Invalid request body',
        { request, requestBody },
      )
    }
  },

  async handleArchive({
    params,
    context,
  }: {
    params: { brandId: string; distributionProfileId: string }
    context: DistributionProfilesAuthContext
  }) {
    try {
      if (!(await DistributionProfilesPolicy.canManage())) {
        return Response.json({ error: 'Forbidden' }, { status: 403 })
      }

      const archived = await DistributionProfilesService.archive(
        context.session.user.id,
        params.brandId,
        params.distributionProfileId,
      )
      return Response.json(archived)
    } catch (error) {
      return handleDistributionProfileControllerError(error, 'Invalid request')
    }
  },
}
