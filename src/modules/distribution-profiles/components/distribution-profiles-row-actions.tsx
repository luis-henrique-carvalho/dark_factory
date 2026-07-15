import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import type { Row } from '@tanstack/react-table'
import { Archive } from 'lucide-react'
import { Button } from '#/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import type { DistributionProfile } from '../schemas'
import { useDistributionProfiles } from './distribution-profiles-provider'

type DistributionProfilesRowActionsProps = {
  row: Row<DistributionProfile>
}

export function DistributionProfilesRowActions({
  row,
}: DistributionProfilesRowActionsProps) {
  const profile = row.original
  const { setOpen, setCurrentRow } = useDistributionProfiles()

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(profile)
            setOpen('update')
          }}
        >
          Edit
        </DropdownMenuItem>
        {profile.status === 'active' ? (
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(profile)
              setOpen('archive')
            }}
          >
            Archive
            <Archive className="ms-auto" size={16} />
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
