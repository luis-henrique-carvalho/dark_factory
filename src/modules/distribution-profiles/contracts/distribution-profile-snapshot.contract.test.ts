import { describe, expect, it } from 'vitest'
import { toDistributionProfileSnapshot } from './distribution-profile-snapshot.contract'

describe('distribution profile snapshot contract', () => {
  it('should preserve profile values for a future project target', () => {
    const snapshot = toDistributionProfileSnapshot({
      platform: 'youtube',
      contentFormat: 'short',
      resolutionWidth: 1080,
      resolutionHeight: 1920,
      aspectRatio: '9:16',
      minDurationSeconds: 15,
      maxDurationSeconds: 60,
      targetDurationSeconds: 45,
      timezone: 'America/Bahia',
      defaultTitleTemplate: '{{title}}',
      defaultDescriptionTemplate: null,
      defaultTagsJson: ['education'],
      defaultHashtagsJson: ['#shorts'],
      defaultPostingTimesJson: [{ day: 'monday', time: '12:00' }],
    })

    expect(snapshot).toEqual(
      expect.objectContaining({
        version: 1,
        platform: 'youtube',
        contentFormat: 'short',
        defaultTags: ['education'],
        defaultHashtags: ['#shorts'],
      }),
    )
  })
})
