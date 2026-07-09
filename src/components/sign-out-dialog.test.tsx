import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import { SignOutDialog } from './sign-out-dialog'
import { sessionQueryKey } from '#/lib/auth/session-query'

const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  removeQueries: vi.fn(),
  signOut: vi.fn(),
}))

const MOCK_HREF = 'https://app.test/dashboard?tab=1'

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-query')>()
  return {
    ...actual,
    useQueryClient: () => ({ removeQueries: mocks.removeQueries }),
  }
})

vi.mock('#/lib/auth/auth-client', () => ({
  authClient: {
    signOut: mocks.signOut,
  },
}))

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>()
  return {
    ...actual,
    useNavigate: () => mocks.navigate,
    useLocation: () => ({ href: MOCK_HREF }),
  }
})

describe('SignOutDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.signOut.mockResolvedValue({})
  })

  it('signs out, clears cached session, and navigates to sign-in with current location as redirect', async () => {
    const { getByRole } = await render(
      <SignOutDialog open onOpenChange={vi.fn()} />
    )

    await userEvent.click(getByRole('button', { name: /^Sign out$/i }))

    await vi.waitFor(() => {
      expect(mocks.signOut).toHaveBeenCalledOnce()
      expect(mocks.removeQueries).toHaveBeenCalledWith({
        queryKey: sessionQueryKey,
      })
      expect(mocks.navigate).toHaveBeenCalledWith({
        to: '/sign-in',
        search: { redirect: MOCK_HREF },
        replace: true,
      })
    })
  })

  it('does not sign out, clear session, or navigate when Cancel is clicked', async () => {
    const { getByRole } = await render(
      <SignOutDialog open onOpenChange={vi.fn()} />
    )

    await userEvent.click(getByRole('button', { name: /^Cancel$/i }))

    expect(mocks.signOut).not.toHaveBeenCalled()
    expect(mocks.removeQueries).not.toHaveBeenCalled()
    expect(mocks.navigate).not.toHaveBeenCalled()
  })
})
