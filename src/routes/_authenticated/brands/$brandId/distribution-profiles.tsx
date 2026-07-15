import { createFileRoute } from '@tanstack/react-router'
import { DistributionProfileListView } from '#/modules/distribution-profiles/views'

export const Route = createFileRoute(
  '/_authenticated/brands/$brandId/distribution-profiles',
)({
  component: DistributionProfilesRoute,
})

function DistributionProfilesRoute() {
  const { brandId } = Route.useParams()
  return <DistributionProfileListView brandId={brandId} />
}
