import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route } from 'react-router-dom'
import LaunchDetailPage from './LaunchDetailPage'

const records = [
  { id: 'latest', flight_number: 725, name: 'USSF-266', date_utc: '2026-11-24' },
  { id: 'starship', flight_number: null, name: 'Starship', date_utc: '2020-12-09' },
  { id: 'first', flight_number: 1, name: 'FalconSAT-2', date_utc: '2006-03-24' },
].map(launch => ({ ...launch, links: { patch: {} }, cores: [] }))

function openDetail(path, props = {}) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Route path={props.archived ? '/launch/archive/:launchKey' : '/launch/:launchKey'} render={route =>
        <LaunchDetailPage {...route} launches={records} {...props} />
      } />
    </MemoryRouter>
  )
}

test('old numeric bookmarks resolve by flight number in a newest-first feed', () => {
  openDetail('/launch/1')
  expect(screen.getByText('FalconSAT-2')).toBeInTheDocument()
  expect(screen.getByText('PREVIOUS')).toHaveAttribute('href', '/launch/latest')
  expect(screen.getByText('NEXT')).toHaveAttribute('href', '/launch/starship')
})

test('a flight without a number opens by id without auxiliary data', () => {
  openDetail('/launch/starship')
  expect(screen.getByText('Starship')).toBeInTheDocument()
  expect(screen.getByText('No Core Information')).toBeInTheDocument()
})

test.each(['null', '0', '9999', 'no-such-id'])('invalid route %s is recoverable', key => {
  openDetail(`/launch/${key}`)
  expect(screen.getByRole('status')).toHaveTextContent('Launch not found.')
  expect(screen.getByText('BACK')).toHaveAttribute('href', '/filter')
})

test('archive links and navigation stay within the original data source', () => {
  openDetail('/launch/archive/old-id', {
    archived: true,
    launches: [{ ...records[1], id: 'old-id', flight_number: 1, name: 'Archive mission' }, records[0]],
  })
  expect(screen.getByText('Archive mission')).toBeInTheDocument()
  expect(screen.getByText('NEXT')).toHaveAttribute('href', '/launch/archive/latest')
  expect(screen.getByText('BACK')).toHaveAttribute('href', '/launches')
})

test('a failed feed is distinct from a missing mission', () => {
  openDetail('/launch/first', { launches: [], loadState: 'error' })
  expect(screen.getByRole('status')).toHaveTextContent('Launch data could not be loaded.')
})
