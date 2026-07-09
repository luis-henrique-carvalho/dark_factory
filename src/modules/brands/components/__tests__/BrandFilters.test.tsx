import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import { BrandFilters } from '../BrandFilters'

describe('BrandFilters', () => {
  it('should call change handler when search text changes', async () => {
    const onChange = vi.fn()
    const { getByRole } = await render(
      <BrandFilters status="active" query="" onChange={onChange} />,
    )

    await userEvent.fill(
      getByRole('searchbox', { name: /Search brands/i }),
      'documentary',
    )

    expect(onChange).toHaveBeenLastCalledWith({
      status: 'active',
      query: 'documentary',
    })
  })

  it('should call change handler when status tab changes', async () => {
    const onChange = vi.fn()
    const { getByRole } = await render(
      <BrandFilters status="active" query="dark" onChange={onChange} />,
    )

    await userEvent.click(getByRole('tab', { name: /Archived/i }))

    expect(onChange).toHaveBeenCalledWith({
      status: 'archived',
      query: 'dark',
    })
  })
})
