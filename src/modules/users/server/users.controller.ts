import { UsersService } from './users.service'
import { UsersPolicy } from './users.policy'
import {
  createUserFormSchema,
  updateUserFormSchema,
} from '../schemas/users.schema'
import type { AuthContext } from '#/modules/auth/server/auth-middleware'

export const UsersController = {
  async handleList() {
    try {
      // Check Authorization
      if (!(await UsersPolicy.canList())) {
        return Response.json({ error: 'Forbidden' }, { status: 403 })
      }

      const users = await UsersService.listAll()
      return Response.json({ users, total: users.length })
    } catch (error: any) {
      return Response.json(
        { error: error.message },
        { status: error.statusCode || 500 },
      )
    }
  },

  async handleDetail({ params }: { params: { userId: string } }) {
    try {
      const user = await UsersService.getById(params.userId)
      return Response.json(user)
    } catch (error: any) {
      return Response.json(
        { error: error.message },
        { status: error.statusCode || 500 },
      )
    }
  },

  async handleCreate({ request }: { request: Request }) {
    try {
      if (!(await UsersPolicy.canCreate())) {
        return Response.json({ error: 'Forbidden' }, { status: 403 })
      }

      const body = await request.json()
      const input = createUserFormSchema.parse(body)
      const created = await UsersService.create(input)

      return Response.json(created, { status: 201 })
    } catch (error: any) {
      return Response.json(
        { error: error.message },
        { status: error.statusCode || 500 },
      )
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
      const input = updateUserFormSchema.parse(body)
      const updated = await UsersService.update(params.userId, input)

      return Response.json(updated)
    } catch (error: any) {
      return Response.json(
        { error: error.message },
        { status: error.statusCode || 500 },
      )
    }
  },

  async handleDelete({ params }: { params: { userId: string } }) {
    try {
      if (!(await UsersPolicy.canDelete())) {
        return Response.json({ error: 'Forbidden' }, { status: 403 })
      }

      const deleted = await UsersService.delete(params.userId)
      return Response.json(deleted)
    } catch (error: any) {
      return Response.json(
        { error: error.message },
        { status: error.statusCode || 500 },
      )
    }
  },

  async handleMe({ context }: { context: AuthContext }) {
    try {
      return Response.json(context.session.user)
    } catch (error: any) {
      return Response.json(
        { error: error.message },
        { status: error.statusCode || 500 },
      )
    }
  },
}
