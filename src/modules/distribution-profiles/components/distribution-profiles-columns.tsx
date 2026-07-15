import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '#/components/ui/badge'
import { DataTableColumnHeader } from '#/components/data-table'
import type { DistributionProfile } from '../schemas'
import { DistributionProfilesRowActions } from './distribution-profiles-row-actions'

export const distributionProfilesColumns: ColumnDef<DistributionProfile>[] = [
  {
    accessorKey: 'slug',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Profile" />
    ),
    meta: { className: 'ps-1 max-w-0 w-1/3', tdClassName: 'ps-4' },
    cell: ({ row }) => (
      <div className="flex min-w-0 flex-col">
        <span className="truncate font-medium">{row.original.slug}</span>
        <span className="truncate text-xs text-muted-foreground">
          {row.original.platform} · {row.original.contentFormat}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'resolutionWidth',
    header: 'Video',
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-sm">
        {row.original.resolutionWidth}×{row.original.resolutionHeight} ·{' '}
        {row.original.aspectRatio}
      </span>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'targetDurationSeconds',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Target" />
    ),
    cell: ({ row }) => `${row.original.targetDurationSeconds}s`,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <Badge
        variant={row.original.status === 'active' ? 'secondary' : 'outline'}
      >
        {row.original.status}
      </Badge>
    ),
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    id: 'actions',
    cell: ({ row }) => <DistributionProfilesRowActions row={row} />,
  },
]
