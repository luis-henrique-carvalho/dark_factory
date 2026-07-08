import { createFileRoute } from '@tanstack/react-router'
import { UsersView } from '#/modules/users/views'
import { listUsersRequestSchema } from '#/modules/users/contracts'
import type { ListUsersRequest } from '#/modules/users/contracts'

export type UsersSearch = ListUsersRequest

export const Route = createFileRoute('/_authenticated/users/')({
  validateSearch: listUsersRequestSchema,
  component: UsersView,
})
