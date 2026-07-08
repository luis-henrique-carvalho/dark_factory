import { sql } from 'drizzle-orm'
import { db } from '#/db'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Runs Drizzle migrations on the test database.
 */
export async function setupTestDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL must be defined for integration tests')
  }

  const migrationsFolder = path.resolve(__dirname, '../../drizzle')
  await migrate(db, { migrationsFolder })
}

/**
 * Truncates all tables to reset the database state between tests.
 */
export async function cleanDatabase() {
  await db.execute(
    sql`TRUNCATE TABLE "session", "account", "verification", "user" CASCADE;`
  )
}
