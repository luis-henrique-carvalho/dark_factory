import { and, count, desc, eq, ilike, or } from 'drizzle-orm'
import { randomUUID } from 'node:crypto'
import { db } from '#/db'
import { brand } from '#/db/schema/brands'
import {
  createContainsSearchPattern,
  toLimitOffset,
} from '#/lib/query/list-query'
import type { ListBrandsRequest } from '../../contracts'

type BrandRow = typeof brand.$inferSelect
type BrandsPage = {
  items: BrandRow[]
  total: number
}

function buildBrandsListWhere({
  userId,
  status = 'active',
  query,
}: ListBrandsRequest & { userId: string }) {
  const searchFilter = query
    ? or(
        ilike(brand.name, createContainsSearchPattern(query)),
        ilike(brand.niche, createContainsSearchPattern(query)),
        ilike(brand.language, createContainsSearchPattern(query)),
      )
    : undefined

  return and(eq(brand.userId, userId), eq(brand.status, status), searchFilter)
}

export class BrandsRepository {
  static async findPage(
    params: ListBrandsRequest & { userId: string },
  ): Promise<BrandsPage> {
    const where = buildBrandsListWhere(params)
    const { limit, offset } = toLimitOffset(params)

    const [items, [{ total }]] = await Promise.all([
      db
        .select()
        .from(brand)
        .where(where)
        .orderBy(desc(brand.createdAt), desc(brand.id))
        .limit(limit)
        .offset(offset),
      db.select({ total: count() }).from(brand).where(where),
    ])

    return { items, total }
  }

  static async findByIdForUser({
    id,
    userId,
  }: {
    id: string
    userId: string
  }): Promise<BrandRow | null> {
    const results = await db
      .select()
      .from(brand)
      .where(and(eq(brand.id, id), eq(brand.userId, userId)))
    return results[0] ?? null
  }

  static async create(
    data: Omit<typeof brand.$inferInsert, 'id'>,
  ): Promise<BrandRow> {
    const id = randomUUID()
    const [created] = await db
      .insert(brand)
      .values({ ...data, id })
      .returning()
    return created
  }

  static async updateForUser({
    id,
    userId,
    data,
  }: {
    id: string
    userId: string
    data: Partial<Omit<typeof brand.$inferInsert, 'id' | 'userId'>>
  }): Promise<BrandRow | null> {
    const rows = await db
      .update(brand)
      .set(data)
      .where(and(eq(brand.id, id), eq(brand.userId, userId)))
      .returning()

    return rows.at(0) ?? null
  }
}
