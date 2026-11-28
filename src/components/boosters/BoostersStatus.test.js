import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import BoostersStatus from './BoostersStatus'

const launches = [{
  id: 'heavy-demo',
  name: 'Heavy demo',
  date_utc: '2020-01-10T14:00:00Z',
  date_local: '2020-01-10T14:00:00Z',
  flight_number: 1,
  cores: [
    { core: 'B101', landing_success: true, landing_type: 'RTLS' },
    { core: 'B102', landing_success: null, landing_type: 'ASDS' },
  ],
}]
const cores = ['B101', 'B102'].map(serial => ({ serial, status: 'active', launches: ['heavy-demo'] }))

test('each core links to the mission with its own landing outcome and keyboard preview', () => {
  render(<MemoryRouter><BoostersStatus cores={cores} launches={launches} /></MemoryRouter>)
  const landed = screen.getByRole('link', { name: 'B101: Heavy demo' })
  const unknown = screen.getByRole('link', { name: 'B102: Heavy demo' })
  expect(landed).toHaveAttribute('href', '/launch/heavy-demo')
  expect(landed).toHaveClass('boosterPage-launchBlock-RTLS')
  expect(unknown).toHaveClass('boosterPage-launchBlock-unknown')
  fireEvent.focus(landed)
  expect(screen.getByText('2020-01-10')).toBeInTheDocument()
  fireEvent.blur(landed)
  expect(screen.queryByText('2020-01-10')).not.toBeInTheDocument()
})

test('empty board explains loading and feed failures', () => {
  const { rerender } = render(<BoostersStatus cores={[]} launches={[]} loadState="loading" />)
  expect(screen.getByRole('status')).toHaveTextContent('Loading core data')
  rerender(<BoostersStatus cores={[]} launches={[]} loadState="error" />)
  expect(screen.getByRole('status')).toHaveTextContent('Core data could not be loaded')
})
