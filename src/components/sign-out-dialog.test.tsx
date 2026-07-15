import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import { SignOutDialog } from './sign-out-dialog'

const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  signOut: vi.fn(),
}))

const MOCK_HREF = 'https://app.test/dashboard?tab=1'

vi.mock('#/lib/auth/auth-client', () => ({
  authClient: {
    signOut: mocks.signOut,
  },
}))

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mocks.navigate,
  useLocation: () => ({ href: MOCK_HREF }),
}))

describe('SignOutDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.signOut.mockResolvedValue({})
  })

  it('signs out and navigates to sign-in with current location as redirect', async () => {
    const { getByRole } = await render(
      <SignOutDialog open onOpenChange={vi.fn()} />,
    )

    await userEvent.click(getByRole('button', { name: /^Sign out$/i }))

    await vi.waitFor(() => {
      expect(mocks.signOut).toHaveBeenCalledOnce()
      expect(mocks.navigate).toHaveBeenCalledWith({
        to: '/sign-in',
        search: { redirect: MOCK_HREF },
        replace: true,
      })
    })
  })

  it('does not sign out or navigate when Cancel is clicked', async () => {
    const { getByRole } = await render(
      <SignOutDialog open onOpenChange={vi.fn()} />,
    )

    await userEvent.click(getByRole('button', { name: /^Cancel$/i }))

    expect(mocks.signOut).not.toHaveBeenCalled()
    expect(mocks.navigate).not.toHaveBeenCalled()
  })
})
