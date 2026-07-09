import { Archive, Pencil } from 'lucide-react'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import type { Brand } from '../schemas'

type BrandListProps = {
  brands: Brand[]
  isLoading?: boolean
  onEdit: (brand: Brand) => void
  onArchive: (brand: Brand) => void
}

export function BrandList({
  brands,
  isLoading = false,
  onEdit,
  onArchive,
}: BrandListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="min-h-40">
            <CardHeader>
              <div className="h-5 w-32 rounded-md bg-muted" />
              <div className="h-4 w-48 rounded-md bg-muted" />
            </CardHeader>
          </Card>
        ))}
      </div>
    )
  }

  if (brands.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No brands yet</CardTitle>
          <CardDescription>
            Create your first content brand to organize scripts, ideas, and
            media generation.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {brands.map((brand) => (
        <Card key={brand.id}>
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <CardTitle
                  role="heading"
                  aria-level={3}
                  className="line-clamp-2 wrap-anywhere"
                >
                  {brand.name}
                </CardTitle>
                <CardDescription className="line-clamp-2 wrap-anywhere">
                  {brand.niche}
                </CardDescription>
              </div>
              <Badge
                className="shrink-0"
                variant={brand.status === 'active' ? 'secondary' : 'outline'}
              >
                {brand.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <dl className="flex flex-col gap-1 text-sm">
              <div className="flex items-center justify-between gap-2">
                <dt className="text-muted-foreground">Language</dt>
                <dd className="font-medium">{brand.language}</dd>
              </div>
            </dl>
          </CardContent>
          <CardFooter className="justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onEdit(brand)}
              aria-label={`Edit ${brand.name}`}
            >
              <Pencil data-icon="inline-start" />
              Edit
            </Button>
            {brand.status === 'active' ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onArchive(brand)}
                aria-label={`Archive ${brand.name}`}
              >
                <Archive data-icon="inline-start" />
                Archive
              </Button>
            ) : null}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
