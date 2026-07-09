import { createFileRoute } from '@tanstack/react-router'
import { SettingsAppearance } from '@/modules/settings/appearance'

export const Route = createFileRoute('/_authenticated/settings/appearance')({
  component: SettingsAppearance,
})
