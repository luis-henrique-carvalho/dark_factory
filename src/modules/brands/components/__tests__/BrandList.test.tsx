import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import {
  Outlet,
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { BrandList } from '../BrandList'
import type { Brand } from '../../schemas'

const BRANDS = [
  {
    id: 'brand-1',
    userId: 'user-1',
    name: 'Dark Shorts',
    niche: 'AI documentary shorts',
    language: 'pt-BR',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
] satisfies Brand[]

function renderBrandList(props: React.ComponentProps<typeof BrandList>) {
  const rootRoute = createRootRoute({ component: () => <Outlet /> })
  const brandsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => <BrandList {...props} />,
  })
  const profilesRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/distribution-profiles/$brandId',
    component: () => null,
  })
  const router = createRouter({
    routeTree: rootRoute.addChildren([brandsRoute, profilesRoute]),
    history: createMemoryHistory({ initialEntries: ['/'] }),
  })

  return render(<RouterProvider router={router} />)
}

describe('BrandList', () => {
  it('should render brand cards with name, niche, language, and status', async () => {
    const { getByRole, getByText } = await renderBrandList({
      brands: BRANDS,
      onEdit: vi.fn(),
      onArchive: vi.fn(),
    })

    await expect
      .element(getByRole('heading', { name: 'Dark Shorts' }))
      .toBeInTheDocument()
    await expect.element(getByText('AI documentary shorts')).toBeInTheDocument()
    await expect.element(getByText('pt-BR')).toBeInTheDocument()
    await expect.element(getByText('active')).toBeInTheDocument()
  })

  it('should call edit and archive handlers from card actions', async () => {
    const onEdit = vi.fn()
    const onArchive = vi.fn()
    const { getByRole } = await renderBrandList({
      brands: BRANDS,
      onEdit,
      onArchive,
    })

    await userEvent.click(getByRole('button', { name: /Edit Dark Shorts/i }))
    expect(onEdit).toHaveBeenCalledWith(BRANDS[0])

    await userEvent.click(getByRole('button', { name: /Archive Dark Shorts/i }))
    expect(onArchive).toHaveBeenCalledWith(BRANDS[0])
  })

  it('should render an empty state when there are no brands', async () => {
    const { getByText } = await renderBrandList({
      brands: [],
      onEdit: vi.fn(),
      onArchive: vi.fn(),
    })

    await expect.element(getByText(/No brands yet/i)).toBeInTheDocument()
  })
})
