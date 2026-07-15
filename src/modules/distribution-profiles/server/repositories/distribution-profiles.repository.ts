import { and, count, desc, eq, ilike, or } from 'drizzle-orm'
import { randomUUID } from 'node:crypto'
import { db } from '#/db'
import { brand } from '#/db/schema/brands'
import { distributionProfile } from '#/db/schema/distribution-profiles'
import {
  createContainsSearchPattern,
  toLimitOffset,
} from '#/lib/query/list-query'
import type { ListDistributionProfilesRequest } from '../../contracts'

type DistributionProfileRow = typeof distributionProfile.$inferSelect

function buildWhere({
  userId,
  brandId,
  status = 'active',
  query,
}: ListDistributionProfilesRequest & { userId: string; brandId: string }) {
  const searchFilter = query
    ? or(
        ilike(distributionProfile.slug, createContainsSearchPattern(query)),
        ilike(distributionProfile.platform, createContainsSearchPattern(query)),
        ilike(
          distributionProfile.contentFormat,
          createContainsSearchPattern(query),
        ),
      )
    : undefined

  return and(
    eq(brand.userId, userId),
    eq(distributionProfile.brandId, brandId),
    eq(distributionProfile.status, status),
    searchFilter,
  )
}

export class DistributionProfilesRepository {
  static async brandBelongsToUser({
    brandId,
    userId,
  }: {
    brandId: string
    userId: string
  }) {
    const rows = await db
      .select({ id: brand.id })
      .from(brand)
      .where(and(eq(brand.id, brandId), eq(brand.userId, userId)))

    return rows.length > 0
  }

  static async findPage(
    params: ListDistributionProfilesRequest & {
      userId: string
      brandId: string
    },
  ) {
    const where = buildWhere(params)
    const { limit, offset } = toLimitOffset(params)

    const [items, [{ total }]] = await Promise.all([
      db
        .select({ profile: distributionProfile })
        .from(distributionProfile)
        .innerJoin(brand, eq(distributionProfile.brandId, brand.id))
        .where(where)
        .orderBy(
          desc(distributionProfile.createdAt),
          desc(distributionProfile.id),
        )
        .limit(limit)
        .offset(offset),
      db
        .select({ total: count() })
        .from(distributionProfile)
        .innerJoin(brand, eq(distributionProfile.brandId, brand.id))
        .where(where),
    ])

    return {
      items: items.map(({ profile }) => profile),
      total,
    }
  }

  static async create(
    data: Omit<typeof distributionProfile.$inferInsert, 'id'>,
  ): Promise<DistributionProfileRow> {
    const [created] = await db
      .insert(distributionProfile)
      .values({ ...data, id: randomUUID() })
      .returning()
    return created
  }

  static async updateForUser({
    id,
    brandId,
    userId,
    data,
  }: {
    id: string
    brandId: string
    userId: string
    data: Partial<
      Omit<typeof distributionProfile.$inferInsert, 'id' | 'brandId'>
    >
  }): Promise<DistributionProfileRow | null> {
    const rows = await db
      .update(distributionProfile)
      .set(data)
      .where(
        and(
          eq(distributionProfile.id, id),
          eq(distributionProfile.brandId, brand.id),
          eq(distributionProfile.brandId, brandId),
          eq(brand.userId, userId),
        ),
      )
      .from(brand)
      .returning()

    return rows.at(0) ?? null
  }
}
