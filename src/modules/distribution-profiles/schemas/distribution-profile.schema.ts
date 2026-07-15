import { z } from 'zod'

export const distributionProfileStatusSchema = z.enum(['active', 'archived'])

export const postingTimeSchema = z.object({
  day: z.string().min(1),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
})

const distributionProfileFields = {
  slug: z.string().trim().min(1, 'Slug is required').max(100),
  platform: z.string().trim().min(1).max(50),
  contentFormat: z.string().trim().min(1).max(50),
  resolutionWidth: z.number().int().positive(),
  resolutionHeight: z.number().int().positive(),
  aspectRatio: z.string().trim().min(3).max(20),
  minDurationSeconds: z.number().int().nonnegative(),
  maxDurationSeconds: z.number().int().positive(),
  targetDurationSeconds: z.number().int().positive(),
  timezone: z.string().trim().min(1).max(100),
  defaultTitleTemplate: z.string().max(500).nullable().optional(),
  defaultDescriptionTemplate: z.string().max(5000).nullable().optional(),
  defaultTags: z.array(z.string().trim().min(1).max(100)).max(100),
  defaultHashtags: z.array(z.string().trim().min(1).max(100)).max(100),
  defaultPostingTimes: z.array(postingTimeSchema).max(100),
}

function withDurationValidation<T extends z.ZodTypeAny>(schema: T) {
  return schema.superRefine((value, context) => {
    const input = value as {
      minDurationSeconds: number
      targetDurationSeconds: number
      maxDurationSeconds: number
    }

    if (input.minDurationSeconds > input.targetDurationSeconds) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['targetDurationSeconds'],
        message: 'Target duration must be at least the minimum duration',
      })
    }

    if (input.targetDurationSeconds > input.maxDurationSeconds) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['maxDurationSeconds'],
        message: 'Maximum duration must be at least the target duration',
      })
    }
  })
}

export const createDistributionProfileSchema = withDurationValidation(
  z.object(distributionProfileFields),
)

export const updateDistributionProfileSchema = withDurationValidation(
  z
    .object(distributionProfileFields)
    .partial()
    .refine((value) => Object.keys(value).length > 0, {
      message: 'At least one field must be provided',
    }),
)

export const distributionProfileSchema = z.object({
  id: z.string(),
  brandId: z.string(),
  slug: z.string(),
  platform: z.string(),
  contentFormat: z.string(),
  resolutionWidth: z.number(),
  resolutionHeight: z.number(),
  aspectRatio: z.string(),
  minDurationSeconds: z.number(),
  maxDurationSeconds: z.number(),
  targetDurationSeconds: z.number(),
  timezone: z.string(),
  defaultTitleTemplate: z.string().nullable(),
  defaultDescriptionTemplate: z.string().nullable(),
  defaultTagsJson: z.array(z.string()),
  defaultHashtagsJson: z.array(z.string()),
  defaultPostingTimesJson: z.array(postingTimeSchema),
  status: distributionProfileStatusSchema,
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
})

export type DistributionProfile = z.infer<typeof distributionProfileSchema>
export type DistributionProfileStatus = z.infer<
  typeof distributionProfileStatusSchema
>
export type CreateDistributionProfileInput = z.infer<
  typeof createDistributionProfileSchema
>
export type UpdateDistributionProfileInput = z.infer<
  typeof updateDistributionProfileSchema
>
