import { ConfigDrawer } from '#/components/config-drawer'
import { Header } from '#/components/layout/header'
import { Main } from '#/components/layout/main'
import { ProfileDropdown } from '#/components/profile-dropdown'
import { Search } from '#/components/search'
import { ThemeSwitch } from '#/components/theme-switch'
import { DistributionProfilesDialogs } from '../components/distribution-profiles-dialogs'
import { DistributionProfilesPrimaryButtons } from '../components/distribution-profiles-primary-buttons'
import { DistributionProfilesProvider } from '../components/distribution-profiles-provider'
import { DistributionProfilesTable } from '../components/distribution-profiles-table'
import { useDistributionProfilesList } from '../hooks/useDistributionProfiles'

type DistributionProfileListViewProps = { brandId: string }

export function DistributionProfileListView({
  brandId,
}: DistributionProfileListViewProps) {
  const listParams = { page: 1, limit: 100 }
  const { data } = useDistributionProfilesList(brandId, listParams)

  return (
    <DistributionProfilesProvider brandId={brandId}>
      <Header fixed>
        <Search className="me-auto" />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Distribution profiles
            </h2>
            <p className="text-muted-foreground">
              Configure reusable platform and format defaults for this brand.
            </p>
          </div>
          <DistributionProfilesPrimaryButtons />
        </div>
        <DistributionProfilesTable data={data?.items ?? []} />
      </Main>

      <DistributionProfilesDialogs />
    </DistributionProfilesProvider>
  )
}
