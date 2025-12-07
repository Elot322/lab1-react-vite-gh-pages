import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Counter from '../components/Counter'

describe('Counter', () => {
  it('increments count when button is clicked', () => {
    render(<Counter />)

    const button = screen.getByRole('button')

    // изначально count is 0
    expect(button.textContent).toContain('count is 0')

    // клик
    fireEvent.click(button)

    // должно стать count is 1
    expect(button.textContent).toContain('count is 1')
  })
})
