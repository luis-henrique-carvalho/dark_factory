import { useState } from 'react'
import { Plus } from 'lucide-react'
import { ConfigDrawer } from '#/components/config-drawer'
import { Header } from '#/components/layout/header'
import { Main } from '#/components/layout/main'
import { Search } from '#/components/search'
import { ThemeSwitch } from '#/components/theme-switch'
import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { BrandForm } from '../components/BrandForm'
import { BrandFilters } from '../components/BrandFilters'
import { BrandList } from '../components/BrandList'
import { useBrandsList, useBrandsMutations } from '../hooks/useBrands'
import type { Brand, BrandStatus, CreateBrandInput } from '../schemas'

export function BrandListView() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [currentBrand, setCurrentBrand] = useState<Brand | null>(null)
  const [status, setStatus] = useState<BrandStatus>('active')
  const [query, setQuery] = useState('')
  const listParams = {
    page: 1,
    limit: 20,
    status,
    query: query.trim() || undefined,
  }
  const { data, isLoading } = useBrandsList(listParams)
  const { createBrand, updateBrand, archiveBrand, isCreating, isUpdating } =
    useBrandsMutations()

  const isSubmitting = isCreating || isUpdating
  const brands = data?.items ?? []
  const isEdit = Boolean(currentBrand)

  const closeForm = () => {
    setIsFormOpen(false)
    setCurrentBrand(null)
  }

  const handleSubmit = async (values: CreateBrandInput) => {
    if (currentBrand) {
      await updateBrand({ id: currentBrand.id, data: values })
    } else {
      await createBrand(values)
    }
    closeForm()
  }

  return (
    <>
      <Header fixed>
        <Search className="me-auto" />
        <ThemeSwitch />
        <ConfigDrawer />
      </Header>

      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Brands</h2>
            <p className="text-muted-foreground">
              Manage content brands, editorial niches, and working languages.
            </p>
          </div>
          <Button type="button" onClick={() => setIsFormOpen(true)}>
            <Plus data-icon="inline-start" />
            New Brand
          </Button>
        </div>

        <BrandFilters
          status={status}
          query={query}
          onChange={(filters) => {
            setStatus(filters.status)
            setQuery(filters.query)
          }}
        />

        <BrandList
          brands={brands}
          isLoading={isLoading}
          onEdit={(brand) => {
            setCurrentBrand(brand)
            setIsFormOpen(true)
          }}
          onArchive={(brand) => archiveBrand(brand.id)}
        />
      </Main>

      <Dialog
        open={isFormOpen}
        onOpenChange={(open) => {
          if (open) {
            setIsFormOpen(true)
          } else {
            closeForm()
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit Brand' : 'Create Brand'}</DialogTitle>
            <DialogDescription>
              Define the editorial line used to organize generated content.
            </DialogDescription>
          </DialogHeader>
          <BrandForm
            key={currentBrand?.id ?? 'new-brand'}
            defaultValues={currentBrand ?? undefined}
            isSubmitting={isSubmitting}
            submitLabel={isEdit ? 'Save Changes' : 'Save Brand'}
            onCancel={closeForm}
            onSubmit={handleSubmit}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
