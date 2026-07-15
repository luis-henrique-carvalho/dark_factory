import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import { DistributionProfileForm } from '../distribution-profile-form'

describe('DistributionProfileForm', () => {
  it('should render platform and format fields and submit valid values', async () => {
    const onSubmit = vi.fn()
    const { getByRole } = await render(
      <DistributionProfileForm onSubmit={onSubmit} />,
    )

    await userEvent.fill(
      getByRole('textbox', { name: /Slug/i }),
      'youtube-short',
    )
    await userEvent.click(getByRole('combobox', { name: /Platform/i }))
    await userEvent.click(getByRole('option', { name: 'YouTube' }))
    await userEvent.click(getByRole('combobox', { name: /Content format/i }))
    await userEvent.click(getByRole('option', { name: 'Short' }))
    await userEvent.click(getByRole('button', { name: /Save Profile/i }))

    expect(onSubmit).toHaveBeenCalledOnce()
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        slug: 'youtube-short',
        platform: 'youtube',
        contentFormat: 'short',
      }),
    )
  })

  it('should show validation errors when slug is empty', async () => {
    const onSubmit = vi.fn()
    const { getByRole, getByText } = await render(
      <DistributionProfileForm onSubmit={onSubmit} />,
    )

    await userEvent.click(getByRole('button', { name: /Save Profile/i }))

    await expect.element(getByText(/Slug is required/i)).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
