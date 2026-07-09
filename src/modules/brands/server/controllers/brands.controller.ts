import { BrandsService } from '../services/brands.service'
import { handleBrandsControllerError } from '../errors/brands.error-handler'
import { BrandsPolicy } from '../policies/brands.policy'
import { createBrandDto, updateBrandDto } from '../dtos/brands.dto'
import { listBrandsRequestSchema } from '../../contracts'

type BrandsAuthContext = {
  session: {
    user: {
      id: string
    }
  }
}

export const BrandsController = {
  async handleList({
    request,
    context,
  }: {
    request: Request
    context: BrandsAuthContext
  }) {
    try {
      if (!(await BrandsPolicy.canManage())) {
        return Response.json({ error: 'Forbidden' }, { status: 403 })
      }

      const searchParams = Object.fromEntries(new URL(request.url).searchParams)
      const params = listBrandsRequestSchema.parse(searchParams)
      const response = await BrandsService.list({
        userId: context.session.user.id,
        ...params,
      })

      return Response.json(response)
    } catch (error) {
      return handleBrandsControllerError(error, 'Invalid query params', {
        request,
      })
    }
  },

  async handleCreate({
    request,
    context,
  }: {
    request: Request
    context: BrandsAuthContext
  }) {
    let requestBody: unknown

    try {
      if (!(await BrandsPolicy.canManage())) {
        return Response.json({ error: 'Forbidden' }, { status: 403 })
      }

      requestBody = await request.json()
      const input = createBrandDto.parse(requestBody)
      const created = await BrandsService.create(context.session.user.id, input)

      return Response.json(created, { status: 201 })
    } catch (error) {
      return handleBrandsControllerError(error, 'Invalid request body', {
        request,
        requestBody,
      })
    }
  },

  async handleUpdate({
    request,
    params,
    context,
  }: {
    request: Request
    params: { brandId: string }
    context: BrandsAuthContext
  }) {
    let requestBody: unknown

    try {
      if (!(await BrandsPolicy.canManage())) {
        return Response.json({ error: 'Forbidden' }, { status: 403 })
      }

      requestBody = await request.json()
      const input = updateBrandDto.parse(requestBody)
      const updated = await BrandsService.update(
        context.session.user.id,
        params.brandId,
        input,
      )

      return Response.json(updated)
    } catch (error) {
      return handleBrandsControllerError(error, 'Invalid request body', {
        request,
        requestBody,
      })
    }
  },

  async handleArchive({
    request,
    params,
    context,
  }: {
    request?: Request
    params: { brandId: string }
    context: BrandsAuthContext
  }) {
    try {
      if (!(await BrandsPolicy.canManage())) {
        return Response.json({ error: 'Forbidden' }, { status: 403 })
      }

      const archived = await BrandsService.archive(
        context.session.user.id,
        params.brandId,
      )
      return Response.json(archived)
    } catch (error) {
      return handleBrandsControllerError(error, 'Invalid request', { request })
    }
  },
}
