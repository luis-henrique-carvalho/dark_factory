import { Button } from '#/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '#/components/ui/sheet'
import { DistributionProfileForm } from './distribution-profile-form'
import type {
  CreateDistributionProfileInput,
  DistributionProfile,
} from '../schemas'

type DistributionProfileMutateDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: DistributionProfile | null
  isSubmitting?: boolean
  onSubmit: (values: CreateDistributionProfileInput) => void | Promise<void>
}

export function DistributionProfileMutateDrawer({
  open,
  onOpenChange,
  currentRow,
  isSubmitting = false,
  onSubmit,
}: DistributionProfileMutateDrawerProps) {
  const isUpdate = Boolean(currentRow)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader className="text-start">
          <SheetTitle>
            {isUpdate ? 'Update' : 'Create'} distribution profile
          </SheetTitle>
          <SheetDescription>
            {isUpdate
              ? 'Update the profile configuration.'
              : 'Define how content should be prepared for a platform and format.'}{' '}
            Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <DistributionProfileForm
          defaultValues={
            currentRow
              ? {
                  slug: currentRow.slug,
                  platform: currentRow.platform,
                  contentFormat: currentRow.contentFormat,
                  resolutionWidth: currentRow.resolutionWidth,
                  resolutionHeight: currentRow.resolutionHeight,
                  aspectRatio: currentRow.aspectRatio,
                  minDurationSeconds: currentRow.minDurationSeconds,
                  targetDurationSeconds: currentRow.targetDurationSeconds,
                  maxDurationSeconds: currentRow.maxDurationSeconds,
                  timezone: currentRow.timezone,
                  defaultTitleTemplate: currentRow.defaultTitleTemplate,
                  defaultDescriptionTemplate:
                    currentRow.defaultDescriptionTemplate,
                  defaultTags: currentRow.defaultTagsJson,
                  defaultHashtags: currentRow.defaultHashtagsJson,
                  defaultPostingTimes: currentRow.defaultPostingTimesJson,
                }
              : undefined
          }
          isSubmitting={isSubmitting}
          formId="distribution-profile-form"
          showActions={false}
          onSubmit={onSubmit}
        />
        <SheetFooter className="gap-2">
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
          <Button form="distribution-profile-form" type="submit">
            {isSubmitting ? 'Saving...' : 'Save changes'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
