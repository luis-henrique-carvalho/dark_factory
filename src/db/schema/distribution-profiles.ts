import { relations } from 'drizzle-orm'
import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core'
import { brand } from './brands.ts'

export type PostingTime = {
  day: string
  time: string
}

export const distributionProfile = pgTable(
  'distribution_profile',
  {
    id: text('id').primaryKey(),
    brandId: text('brand_id')
      .notNull()
      .references(() => brand.id, { onDelete: 'cascade' }),
    slug: text('slug').notNull(),
    platform: text('platform').notNull(),
    contentFormat: text('content_format').notNull(),
    resolutionWidth: integer('resolution_width').notNull(),
    resolutionHeight: integer('resolution_height').notNull(),
    aspectRatio: text('aspect_ratio').notNull(),
    minDurationSeconds: integer('min_duration_seconds').notNull(),
    maxDurationSeconds: integer('max_duration_seconds').notNull(),
    targetDurationSeconds: integer('target_duration_seconds').notNull(),
    timezone: text('timezone').notNull(),
    defaultTitleTemplate: text('default_title_template'),
    defaultDescriptionTemplate: text('default_description_template'),
    defaultTagsJson: jsonb('default_tags_json').$type<string[]>().notNull(),
    defaultHashtagsJson: jsonb('default_hashtags_json')
      .$type<string[]>()
      .notNull(),
    defaultPostingTimesJson: jsonb('default_posting_times_json')
      .$type<PostingTime[]>()
      .notNull(),
    status: text('status').default('active').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index('distribution_profile_brandId_idx').on(table.brandId),
    uniqueIndex('distribution_profile_brandId_slug_idx').on(
      table.brandId,
      table.slug,
    ),
  ],
)

export const distributionProfileRelations = relations(
  distributionProfile,
  ({ one }) => ({
    brand: one(brand, {
      fields: [distributionProfile.brandId],
      references: [brand.id],
    }),
  }),
)
