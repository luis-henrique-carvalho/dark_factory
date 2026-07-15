import { z } from 'zod'
import { postingTimeSchema } from '../schemas'

/**
 * Contract reserved for EPIC 07 content project targets.
 * A target snapshot must copy these values instead of resolving the profile
 * again after the project is created.
 */
export const distributionProfileSnapshotSchema = z.object({
  version: z.literal(1),
  platform: z.string(),
  contentFormat: z.string(),
  resolutionWidth: z.number().int().positive(),
  resolutionHeight: z.number().int().positive(),
  aspectRatio: z.string(),
  minDurationSeconds: z.number().int().nonnegative(),
  maxDurationSeconds: z.number().int().positive(),
  targetDurationSeconds: z.number().int().positive(),
  timezone: z.string(),
  defaultTitleTemplate: z.string().nullable(),
  defaultDescriptionTemplate: z.string().nullable(),
  defaultTags: z.array(z.string()),
  defaultHashtags: z.array(z.string()),
  defaultPostingTimes: z.array(postingTimeSchema),
})

export type DistributionProfileSnapshot = z.infer<
  typeof distributionProfileSnapshotSchema
>

export function toDistributionProfileSnapshot(profile: {
  platform: string
  contentFormat: string
  resolutionWidth: number
  resolutionHeight: number
  aspectRatio: string
  minDurationSeconds: number
  maxDurationSeconds: number
  targetDurationSeconds: number
  timezone: string
  defaultTitleTemplate: string | null
  defaultDescriptionTemplate: string | null
  defaultTagsJson: string[]
  defaultHashtagsJson: string[]
  defaultPostingTimesJson: Array<{ day: string; time: string }>
}): DistributionProfileSnapshot {
  return distributionProfileSnapshotSchema.parse({
    version: 1,
    platform: profile.platform,
    contentFormat: profile.contentFormat,
    resolutionWidth: profile.resolutionWidth,
    resolutionHeight: profile.resolutionHeight,
    aspectRatio: profile.aspectRatio,
    minDurationSeconds: profile.minDurationSeconds,
    maxDurationSeconds: profile.maxDurationSeconds,
    targetDurationSeconds: profile.targetDurationSeconds,
    timezone: profile.timezone,
    defaultTitleTemplate: profile.defaultTitleTemplate,
    defaultDescriptionTemplate: profile.defaultDescriptionTemplate,
    defaultTags: profile.defaultTagsJson,
    defaultHashtags: profile.defaultHashtagsJson,
    defaultPostingTimes: profile.defaultPostingTimesJson,
  })
}
