import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '#/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '#/components/ui/form'
import { Input } from '#/components/ui/input'
import { Textarea } from '#/components/ui/textarea'
import { SelectDropdown } from '#/components/select-dropdown'
import { createDistributionProfileSchema } from '../schemas'
import type { CreateDistributionProfileInput } from '../schemas'

type DistributionProfileFormProps = {
  defaultValues?: Partial<CreateDistributionProfileInput>
  isSubmitting?: boolean
  submitLabel?: string
  formId?: string
  showActions?: boolean
  onCancel?: () => void
  onSubmit: (values: CreateDistributionProfileInput) => void | Promise<void>
}

const EMPTY_VALUES: CreateDistributionProfileInput = {
  slug: '',
  platform: 'youtube',
  contentFormat: 'short',
  resolutionWidth: 1080,
  resolutionHeight: 1920,
  aspectRatio: '9:16',
  minDurationSeconds: 15,
  targetDurationSeconds: 45,
  maxDurationSeconds: 60,
  timezone: 'America/Bahia',
  defaultTitleTemplate: '',
  defaultDescriptionTemplate: '',
  defaultTags: [],
  defaultHashtags: [],
  defaultPostingTimes: [],
}

const PLATFORM_OPTIONS = [
  { label: 'YouTube', value: 'youtube' },
  { label: 'TikTok', value: 'tiktok' },
  { label: 'Instagram', value: 'instagram' },
]

const CONTENT_FORMAT_OPTIONS = [
  { label: 'Short', value: 'short' },
  { label: 'Long form', value: 'long' },
  { label: 'Reel', value: 'reel' },
]

const ASPECT_RATIO_OPTIONS = [
  { label: '9:16 — vertical', value: '9:16' },
  { label: '16:9 — landscape', value: '16:9' },
  { label: '1:1 — square', value: '1:1' },
  { label: '4:5 — portrait', value: '4:5' },
]

const TIMEZONE_OPTIONS = [
  { label: 'America/Bahia', value: 'America/Bahia' },
  { label: 'America/Sao_Paulo', value: 'America/Sao_Paulo' },
  { label: 'UTC', value: 'UTC' },
]

export function DistributionProfileForm({
  defaultValues,
  isSubmitting = false,
  submitLabel = 'Save Profile',
  formId = 'distribution-profile-form',
  showActions = true,
  onCancel,
  onSubmit,
}: DistributionProfileFormProps) {
  const form = useForm<CreateDistributionProfileInput>({
    resolver: zodResolver(createDistributionProfileSchema),
    defaultValues: {
      ...EMPTY_VALUES,
      ...defaultValues,
    },
  })

  return (
    <Form {...form}>
      <form
        id={formId}
        onSubmit={form.handleSubmit((values) => onSubmit(values))}
        className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto px-4"
      >
        <div className="grid gap-4">
          {(['slug'] as const).map((name) => (
            <FormField
              key={name}
              control={form.control}
              name={name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{name}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <FormField
            control={form.control}
            name="platform"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Platform</FormLabel>
                <SelectDropdown
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                  items={PLATFORM_OPTIONS}
                  placeholder="Select a platform"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contentFormat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content format</FormLabel>
                <SelectDropdown
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                  items={CONTENT_FORMAT_OPTIONS}
                  placeholder="Select a format"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="aspectRatio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Aspect ratio</FormLabel>
                <SelectDropdown
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                  items={ASPECT_RATIO_OPTIONS}
                  placeholder="Select an aspect ratio"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="timezone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Timezone</FormLabel>
                <SelectDropdown
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                  items={TIMEZONE_OPTIONS}
                  placeholder="Select a timezone"
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4">
          {(
            [
              'resolutionWidth',
              'resolutionHeight',
              'minDurationSeconds',
              'targetDurationSeconds',
              'maxDurationSeconds',
            ] as const
          ).map((name) => (
            <FormField
              key={name}
              control={form.control}
              name={name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{name}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(event) =>
                        field.onChange(event.target.valueAsNumber)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        <FormField
          control={form.control}
          name="defaultTitleTemplate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default title template</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="defaultDescriptionTemplate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default description template</FormLabel>
              <FormControl>
                <Textarea {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {showActions ? (
          <div className="flex justify-end gap-2 pt-2">
            {onCancel ? (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            ) : null}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : submitLabel}
            </Button>
          </div>
        ) : null}
      </form>
    </Form>
  )
}
