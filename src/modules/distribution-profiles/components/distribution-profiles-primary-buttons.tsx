import { Plus } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { useDistributionProfiles } from './distribution-profiles-provider'

export function DistributionProfilesPrimaryButtons() {
  const { setOpen } = useDistributionProfiles()

  return (
    <Button className="space-x-1" onClick={() => setOpen('create')}>
      <span>Create</span>
      <Plus size={18} />
    </Button>
  )
}
