import { useQueryClient } from '@tanstack/react-query'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { authClient } from '#/lib/auth/auth-client'
import { sessionQueryKey } from '#/lib/auth/session-query'
import { ConfirmDialog } from '#/components/confirm-dialog'

interface SignOutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SignOutDialog({ open, onOpenChange }: SignOutDialogProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()

  const handleSignOut = async () => {
    try {
      await authClient.signOut()
    } catch (e) {
      console.error('Failed to sign out:', e)
    }
    queryClient.removeQueries({ queryKey: sessionQueryKey })
    navigate({
      to: '/sign-in',
      search: { redirect: location.href },
      replace: true,
    })
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Sign out"
      desc="Are you sure you want to sign out? You will need to sign in again to access your account."
      confirmText="Sign out"
      destructive
      handleConfirm={handleSignOut}
      className="sm:max-w-sm"
    />
  )
}
