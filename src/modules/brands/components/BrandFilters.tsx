import { Search } from 'lucide-react'
import { Input } from '#/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '#/components/ui/tabs'
import type { BrandStatus } from '../schemas'

type BrandFiltersProps = {
  status: BrandStatus
  query: string
  onChange: (filters: { status: BrandStatus; query: string }) => void
}

export function BrandFilters({ status, query, onChange }: BrandFiltersProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-sm">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="search"
          aria-label="Search brands"
          placeholder="Search by name, niche, or language"
          value={query}
          onChange={(event) =>
            onChange({ status, query: event.currentTarget.value })
          }
          className="ps-9"
        />
      </div>

      <Tabs
        value={status}
        onValueChange={(value) =>
          onChange({ status: value as BrandStatus, query })
        }
      >
        <TabsList aria-label="Brand status filter">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}
