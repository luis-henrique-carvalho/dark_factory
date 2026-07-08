type CreateUserResponse = {
  id: string
  name: string
  email: string
}

const DEFAULT_BASE_URL = 'http://localhost:3000'
const DEFAULT_COUNT = 50

function readCount() {
  const raw = process.argv[2] ?? process.env.USER_SEED_COUNT
  if (!raw) return DEFAULT_COUNT

  const count = Number(raw)
  if (!Number.isInteger(count) || count < 1) {
    throw new Error(`Invalid user count: ${raw}`)
  }

  return count
}

async function createUser({
  baseUrl,
  name,
  email,
}: {
  baseUrl: string
  name: string
  email: string
}) {
  const response = await fetch(new URL('/api/v1/users', baseUrl), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(
      `Failed to create ${email}: ${response.status} ${response.statusText} ${body}`,
    )
  }

  return (await response.json()) as CreateUserResponse
}

async function main() {
  const baseUrl = process.env.API_BASE_URL ?? DEFAULT_BASE_URL
  const count = readCount()
  const batch = process.env.USER_SEED_BATCH ?? Date.now().toString()

  console.log(`Creating ${count} users at ${baseUrl}`)

  for (let index = 1; index <= count; index += 1) {
    const paddedIndex = String(index).padStart(2, '0')
    const user = await createUser({
      baseUrl,
      name: `Pagination Test User ${paddedIndex}`,
      email: `pagination-test-${batch}-${paddedIndex}@darkfactory.test`,
    })

    console.log(`${paddedIndex}/${count} created ${user.email}`)
  }

  console.log('Done.')
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
