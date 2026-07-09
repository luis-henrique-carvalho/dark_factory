import { createFileRoute } from '@tanstack/react-router'
import { BrandListView } from '#/modules/brands/views'

export const Route = createFileRoute('/_authenticated/brands/')({
  component: BrandListView,
})
