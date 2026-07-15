import { ConfirmDialog } from '#/components/confirm-dialog'
import { DistributionProfileMutateDrawer } from './distribution-profile-mutate-drawer'
import { useDistributionProfiles } from './distribution-profiles-provider'
import { useDistributionProfilesMutations } from '../hooks/useDistributionProfiles'
import type { CreateDistributionProfileInput } from '../schemas'

export function DistributionProfilesDialogs() {
  const { brandId, open, setOpen, currentRow, setCurrentRow } =
    useDistributionProfiles()
  const {
    createProfile,
    updateProfile,
    archiveProfile,
    isCreating,
    isUpdating,
    isArchiving,
  } = useDistributionProfilesMutations()

  const closeCurrent = () => {
    setOpen(null)
    setTimeout(() => setCurrentRow(null), 300)
  }

  const handleSubmit = async (values: CreateDistributionProfileInput) => {
    if (currentRow) {
      await updateProfile({ brandId, id: currentRow.id, data: values })
    } else {
      await createProfile({ brandId, data: values })
    }
    closeCurrent()
  }

  const handleArchive = async () => {
    if (!currentRow) return
    await archiveProfile({ brandId, id: currentRow.id })
    closeCurrent()
  }

  return (
    <>
      <DistributionProfileMutateDrawer
        key={`profile-${open}-${currentRow?.id ?? 'create'}`}
        open={open === 'create' || open === 'update'}
        onOpenChange={(value) => {
          if (!value) closeCurrent()
        }}
        currentRow={currentRow}
        isSubmitting={isCreating || isUpdating}
        onSubmit={handleSubmit}
      />

      {currentRow ? (
        <ConfirmDialog
          open={open === 'archive'}
          onOpenChange={(value) => {
            if (!value) closeCurrent()
          }}
          destructive
          isLoading={isArchiving}
          title={`Archive ${currentRow.slug}?`}
          desc="This profile will no longer be available for new projects. Existing references remain intact."
          confirmText="Archive profile"
          handleConfirm={handleArchive}
        />
      ) : null}
    </>
  )
}
