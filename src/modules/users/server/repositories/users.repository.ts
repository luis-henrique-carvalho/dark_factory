import { db } from '#/db'
import { user } from '#/db/schema/users'
import { and, count, desc, eq, ilike } from 'drizzle-orm'
import { randomUUID } from 'node:crypto'
import {
  createContainsSearchPattern,
  toLimitOffset,
} from '#/lib/list-query'
import type { ListUsersRequest } from '../../contracts'

type UserRow = typeof user.$inferSelect
type UsersPage = {
  items: UserRow[]
  total: number
}

function buildUsersListWhere({ query, emailVerified }: ListUsersRequest) {
  const filters = [
    query ? ilike(user.name, createContainsSearchPattern(query)) : undefined,
    emailVerified === undefined
      ? undefined
      : eq(user.emailVerified, emailVerified),
  ].filter((filter) => filter !== undefined)

  return filters.length > 0 ? and(...filters) : undefined
}

export class UsersRepository {
  static async findPage(params: ListUsersRequest): Promise<UsersPage> {
    const where = buildUsersListWhere(params)
    const { limit, offset } = toLimitOffset(params)

    const [items, [{ total }]] = await Promise.all([
      db
        .select()
        .from(user)
        .where(where)
        .orderBy(desc(user.createdAt), desc(user.id))
        .limit(limit)
        .offset(offset),
      db.select({ total: count() }).from(user).where(where),
    ])

    return { items, total }
  }

  static async findById(id: string): Promise<UserRow | null> {
    const results = await db.select().from(user).where(eq(user.id, id))
    return results[0] || null
  }

  static async findByEmail(email: string): Promise<UserRow | null> {
    const results = await db.select().from(user).where(eq(user.email, email))
    return results[0] || null
  }

  static async create(
    data: Omit<typeof user.$inferInsert, 'id'>,
  ): Promise<UserRow> {
    const id = randomUUID()
    const [created] = await db
      .insert(user)
      .values({ ...data, id })
      .returning()
    return created
  }

  static async update(
    id: string,
    data: Partial<Omit<typeof user.$inferInsert, 'id'>>,
  ): Promise<UserRow | null> {
    const [updated] = await db
      .update(user)
      .set(data)
      .where(eq(user.id, id))
      .returning()

    return updated
  }

  static async delete(id: string): Promise<UserRow | null> {
    const [deleted] = await db.delete(user).where(eq(user.id, id)).returning()

    return deleted
  }
}
