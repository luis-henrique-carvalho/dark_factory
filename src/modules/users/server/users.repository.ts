import { db } from '#/db'
import { user } from '#/db/schema/users'
import { eq, desc } from 'drizzle-orm'
import { randomUUID } from 'node:crypto'

export class UsersRepository {
  static async findAll(): Promise<(typeof user.$inferSelect)[]> {
    return await db.select().from(user).orderBy(desc(user.createdAt))
  }

  static async findById(id: string): Promise<typeof user.$inferSelect | null> {
    const results = await db.select().from(user).where(eq(user.id, id))
    return results[0] || null
  }

  static async findByEmail(
    email: string,
  ): Promise<typeof user.$inferSelect | null> {
    const results = await db.select().from(user).where(eq(user.email, email))
    return results[0] || null
  }

  static async create(
    data: Omit<typeof user.$inferInsert, 'id'>,
  ): Promise<typeof user.$inferSelect> {
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
  ): Promise<typeof user.$inferSelect | null> {
    const [updated] = await db
      .update(user)
      .set(data)
      .where(eq(user.id, id))
      .returning()

    return updated
  }

  static async delete(id: string): Promise<typeof user.$inferSelect | null> {
    const [deleted] = await db.delete(user).where(eq(user.id, id)).returning()

    return deleted
  }
}
