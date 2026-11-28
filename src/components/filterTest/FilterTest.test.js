import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import FilterTest from './FilterTest'

const missions = [
  { id: 'first', name: 'First flight', date_utc: '2006-03-24T22:30:00Z', cores: [] },
  { id: 'latest', name: 'Latest flight', date_utc: '2026-01-01T00:30:00Z', cores: [{ reused: true, landing_success: true, landing_type: 'ASDS' }] },
]

function page(launches, loadState = 'ready') {
  return <MemoryRouter><FilterTest launches={launches} loadState={loadState} /></MemoryRouter>
}

test('All Years initially includes the full feed when it arrives, including unknown reuse', () => {
  const { rerender } = render(page([], 'loading'))
  expect(screen.getByRole('status')).toHaveTextContent('Loading')
  rerender(page(missions))
  expect(screen.getByRole('button', { name: 'All Years' })).toHaveAttribute('aria-pressed', 'true')
  expect(screen.getByRole('link', { name: 'First flight' })).toHaveAttribute('href', '/launch/first')
  expect(screen.getByRole('link', { name: 'Latest flight' })).toBeInTheDocument()
  expect(screen.getAllByRole('link')).toHaveLength(2)
})

test('years can be deselected completely, even after choosing the latest year', () => {
  render(page(missions))
  fireEvent.click(screen.getByRole('button', { name: 'Only 2026' }))
  expect(screen.queryByRole('link', { name: 'First flight' })).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: '2026' }))
  expect(screen.getByRole('status')).toHaveTextContent('No launches match')
  fireEvent.click(screen.getByRole('button', { name: 'All Years' }))
  expect(screen.getAllByRole('link')).toHaveLength(2)
})

test('year and date use UTC across a year boundary with an offset', () => {
  render(page([{ ...missions[0], date_utc: '2025-12-31T23:30:00-02:00' }]))
  expect(screen.getByRole('button', { name: 'Only 2026' })).toBeInTheDocument()
  expect(screen.getByText('2026-01-01')).toBeInTheDocument()
})
