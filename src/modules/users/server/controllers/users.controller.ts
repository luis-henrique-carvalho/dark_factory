import { UsersService } from '../services/users.service'
import { handleUsersControllerError } from '../errors/users.error-handler'
import { UsersPolicy } from '../policies/users.policy'
import { createUserDto, updateUserDto } from '../dtos/users.dto'
import { listUsersRequestSchema } from '../../contracts'
import type { AuthContext } from '#/modules/auth/server/auth-middleware'

export const UsersController = {
  async handleList({ request }: { request: Request }) {
    try {
      // Check Authorization
      if (!(await UsersPolicy.canList())) {
        return Response.json({ error: 'Forbidden' }, { status: 403 })
      }

      const searchParams = Object.fromEntries(
        new URL(request.url).searchParams,
      )
      const params = listUsersRequestSchema.parse(searchParams)
      const response = await UsersService.list(params)

      return Response.json(response)
    } catch (error) {
      return handleUsersControllerError(error, 'Invalid query params')
    }
  },

  async handleDetail({ params }: { params: { userId: string } }) {
    try {
      const user = await UsersService.getById(params.userId)
      return Response.json(user)
    } catch (error) {
      return handleUsersControllerError(error, 'Invalid request')
    }
  },

  async handleCreate({ request }: { request: Request }) {
    try {
      if (!(await UsersPolicy.canCreate())) {
        return Response.json({ error: 'Forbidden' }, { status: 403 })
      }

      const body = await request.json()
      const input = createUserDto.parse(body)
      const created = await UsersService.create(input)

      return Response.json(created, { status: 201 })
    } catch (error) {
      return handleUsersControllerError(error, 'Invalid request body')
    }
  },

  async handleUpdate({
    request,
    params,
  }: {
    request: Request
    params: { userId: string }
  }) {
    try {
      if (!(await UsersPolicy.canUpdate())) {
        return Response.json({ error: 'Forbidden' }, { status: 403 })
      }

      const body = await request.json()
      const input = updateUserDto.parse(body)
      const updated = await UsersService.update(params.userId, input)

      return Response.json(updated)
    } catch (error) {
      return handleUsersControllerError(error, 'Invalid request body')
    }
  },

  async handleDelete({ params }: { params: { userId: string } }) {
    try {
      if (!(await UsersPolicy.canDelete())) {
        return Response.json({ error: 'Forbidden' }, { status: 403 })
      }

      const deleted = await UsersService.delete(params.userId)
      return Response.json(deleted)
    } catch (error) {
      return handleUsersControllerError(error, 'Invalid request')
    }
  },

  async handleMe({ context }: { context: AuthContext }) {
    try {
      return Response.json(context.session.user)
    } catch (error) {
      return handleUsersControllerError(error, 'Invalid request')
    }
  },
}
