import React from 'react'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import MainPage from './MainPage'

test('uses completed missions for totals and counts every successful core landing', () => {
  const first = {
    id: 'first', name: 'Falcon Heavy | First mission', date_utc: '2019-04-11T22:35:00Z',
    rocketModel: 'Falcon Heavy', launchOutcome: 'success',
    cores: [{ core: 'B1052', landing_success: true }, { core: 'B1053', landing_success: true }]
  }
  const latest = {
    id: 'latest', name: 'Falcon 9 | Last mission', date_utc: '2020-01-01T00:01:00Z',
    rocketModel: 'Falcon 9', launchOutcome: 'unknown', cores: [{ core: 'B1000' }]
  }
  const next = {
    id: 'next', name: 'Falcon 9 | Planned mission', date_utc: '2019-12-30T00:00:00Z',
    rocketModel: 'Falcon 9', upcoming: true
  }
  render(<MemoryRouter><MainPage launches={[latest, next, first, first]} loadState="ready" /></MemoryRouter>)

  const metrics = screen.getByLabelText('Launch statistics')
  const number = label => within(metrics).getByText(label).nextElementSibling.textContent
  expect(number('Total launches')).toBe('2')
  expect(number('Successful launches')).toBe('1')
  expect(number('Successful landings')).toBe('2')
  expect(screen.getByRole('link', { name: 'Last mission' })).toHaveAttribute('href', '/launch/latest')
  expect(screen.getByRole('link', { name: 'Planned mission' })).toHaveAttribute('href', '/launch/next')
  const lastCard = screen.getByRole('heading', { name: 'Latest launch' }).closest('article')
  expect(within(lastCard).getByText('Landing result').nextElementSibling).toHaveTextContent('Unknown')
})
