import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import { BrandForm } from '../BrandForm'

describe('BrandForm', () => {
  it('should render brand fields and submit valid values', async () => {
    const onSubmit = vi.fn()
    const { getByRole } = await render(<BrandForm onSubmit={onSubmit} />)

    await expect
      .element(getByRole('textbox', { name: /Name/i }))
      .toBeInTheDocument()
    await expect
      .element(getByRole('textbox', { name: /Niche/i }))
      .toBeInTheDocument()
    await expect
      .element(getByRole('textbox', { name: /Language/i }))
      .toBeInTheDocument()

    await userEvent.fill(getByRole('textbox', { name: /Name/i }), 'Dark Shorts')
    await userEvent.fill(
      getByRole('textbox', { name: /Niche/i }),
      'AI documentary shorts',
    )
    await userEvent.fill(getByRole('textbox', { name: /Language/i }), 'pt-BR')
    await userEvent.click(getByRole('button', { name: /Save Brand/i }))

    expect(onSubmit).toHaveBeenCalledOnce()
    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Dark Shorts',
      niche: 'AI documentary shorts',
      language: 'pt-BR',
    })
  })

  it('should show validation messages for empty fields', async () => {
    const onSubmit = vi.fn()
    const { getByRole, getByText } = await render(
      <BrandForm onSubmit={onSubmit} />,
    )

    await userEvent.click(getByRole('button', { name: /Save Brand/i }))

    await expect
      .element(getByText(/Name must be at least 2 characters/i))
      .toBeInTheDocument()
    await expect
      .element(getByText(/Niche must be at least 2 characters/i))
      .toBeInTheDocument()
    await expect
      .element(getByText(/Language must be at least 2 characters/i))
      .toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('should render default values for editing', async () => {
    const { getByRole } = await render(
      <BrandForm
        onSubmit={vi.fn()}
        defaultValues={{
          name: 'Existing Brand',
          niche: 'History',
          language: 'en-US',
        }}
      />,
    )

    await expect
      .element(getByRole('textbox', { name: /Name/i }))
      .toHaveValue('Existing Brand')
    await expect
      .element(getByRole('textbox', { name: /Niche/i }))
      .toHaveValue('History')
    await expect
      .element(getByRole('textbox', { name: /Language/i }))
      .toHaveValue('en-US')
  })
})
