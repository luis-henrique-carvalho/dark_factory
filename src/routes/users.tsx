import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { UsersView } from '#/modules/users/views'
import { roles } from '#/modules/users/data/data'

const usersSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  status: z
    .array(
      z.union([
        z.literal('active'),
        z.literal('inactive'),
        z.literal('invited'),
        z.literal('suspended'),
      ]),
    )
    .optional()
    .catch([]),
  role: z
    .array(z.enum(roles.map((r) => r.value)))
    .optional()
    .catch([]),
  username: z.string().optional().catch(''),
})

export type UsersSearch = z.infer<typeof usersSearchSchema>

export const Route = createFileRoute('/users')({
  validateSearch: usersSearchSchema,
  component: UsersView,
})
