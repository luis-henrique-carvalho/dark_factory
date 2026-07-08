import { describe, expect, it, vi } from 'vitest'
import { UsersRepository } from './users.repository'

const mocks = vi.hoisted(() => {
  const itemsBuilder = {
    from: vi.fn(),
    where: vi.fn(),
    orderBy: vi.fn(),
    limit: vi.fn(),
    offset: vi.fn(),
  }
  const countBuilder = {
    from: vi.fn(),
    where: vi.fn(),
  }
  const select = vi.fn()

  return {
    select,
    itemsBuilder,
    countBuilder,
  }
})

vi.mock('#/db', () => ({
  db: {
    select: mocks.select,
  },
}))

describe('UsersRepository', () => {
  it('should apply pagination and filters to list queries', async () => {
    const row = {
      id: 'user-1',
      name: 'Ana',
      email: 'ana@example.com',
      emailVerified: true,
      image: null,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    }

    mocks.itemsBuilder.from.mockReturnValue(mocks.itemsBuilder)
    mocks.itemsBuilder.where.mockReturnValue(mocks.itemsBuilder)
    mocks.itemsBuilder.orderBy.mockReturnValue(mocks.itemsBuilder)
    mocks.itemsBuilder.limit.mockReturnValue(mocks.itemsBuilder)
    mocks.itemsBuilder.offset.mockResolvedValue([row])

    mocks.countBuilder.from.mockReturnValue(mocks.countBuilder)
    mocks.countBuilder.where.mockResolvedValue([{ total: 3 }])

    mocks.select
      .mockReturnValueOnce(mocks.itemsBuilder)
      .mockReturnValueOnce(mocks.countBuilder)

    await expect(
      UsersRepository.findPage({
        page: 2,
        limit: 10,
        query: 'ana',
        emailVerified: true,
      }),
    ).resolves.toEqual({ items: [row], total: 3 })

    expect(mocks.itemsBuilder.where).toHaveBeenCalledTimes(1)
    expect(mocks.itemsBuilder.orderBy).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
    )
    expect(mocks.itemsBuilder.limit).toHaveBeenCalledWith(10)
    expect(mocks.itemsBuilder.offset).toHaveBeenCalledWith(10)
    expect(mocks.countBuilder.where).toHaveBeenCalledWith(
      mocks.itemsBuilder.where.mock.calls[0]?.[0],
    )
  })
})
