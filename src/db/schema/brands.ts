import { relations } from 'drizzle-orm'
import { pgTable, text, timestamp, index } from 'drizzle-orm/pg-core'
import { user } from './users.ts'

export const brand = pgTable(
  'brand',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    niche: text('niche').notNull(),
    language: text('language').notNull(),
    status: text('status').default('active').notNull(), // 'active' | 'archived'
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index('brand_userId_idx').on(table.userId)],
)

export const brandRelations = relations(brand, ({ one }) => ({
  user: one(user, {
    fields: [brand.userId],
    references: [user.id],
  }),
}))
