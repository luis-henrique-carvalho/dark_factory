import React, { useState } from 'react'
import useDialogState from '#/hooks/use-dialog-state'
import type { DistributionProfile } from '../schemas'

export type DistributionProfileDialogType = 'create' | 'update' | 'archive'

type DistributionProfilesContextValue = {
  brandId: string
  open: DistributionProfileDialogType | null
  setOpen: (value: DistributionProfileDialogType | null) => void
  currentRow: DistributionProfile | null
  setCurrentRow: React.Dispatch<
    React.SetStateAction<DistributionProfile | null>
  >
}

const DistributionProfilesContext =
  React.createContext<DistributionProfilesContextValue | null>(null)

export function DistributionProfilesProvider({
  brandId,
  children,
}: {
  brandId: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<DistributionProfileDialogType>(null)
  const [currentRow, setCurrentRow] = useState<DistributionProfile | null>(null)

  return (
    <DistributionProfilesContext
      value={{ brandId, open, setOpen, currentRow, setCurrentRow }}
    >
      {children}
    </DistributionProfilesContext>
  )
}

export function useDistributionProfiles() {
  const context = React.useContext(DistributionProfilesContext)

  if (!context) {
    throw new Error(
      'useDistributionProfiles has to be used within <DistributionProfilesProvider>',
    )
  }

  return context
}
