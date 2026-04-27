/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import AgendaPage from '../src/components/Agenda/AgendaPage';
import AgendaDayViewPage from '../src/components/Agenda/AgendaDayViewPage';
import AgendaFormPage from '../src/components/Agenda/AgendaFormPage';
import { SelectedAgendaEvent } from '../src/context/NavigationContext';
import { renderWithProviders } from './test-utils';

const TODAY = '2026-03-13';

const MOCK_EDIT_EVENT: SelectedAgendaEvent = {
  id: 1,
  title: 'Consultation audioprothésiste',
  type: 'consultation',
  start: `${TODAY} 09:00`,
  end: `${TODAY} 09:30`,
  location: 'Cabinet Lyon',
  notes: 'Contrôle annuel',
  professionalName: 'Arnaud DEVEZE',
  backgroundColor: '#3ABFBF',
};

const renderAgenda = () => renderWithProviders(<AgendaPage />);
const renderDayView = (date = TODAY) => renderWithProviders(<AgendaDayViewPage date={date} />);
const renderForm = (event: SelectedAgendaEvent | null = null) =>
  renderWithProviders(<AgendaFormPage event={event} />);

// ── AgendaPage ─────────────────────────────────────────────────────────────────

test('AgendaPage renders without crashing', async () => {
  await ReactTestRenderer.act(async () => { renderAgenda(); });
});

test('AgendaPage displays title Mon agenda', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => { renderer = renderAgenda(); });
  expect(JSON.stringify(renderer!.toJSON())).toContain('Mon agenda');
});

test('AgendaPage renders calendar navigation arrows', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => { renderer = renderAgenda(); });
  const prev = renderer!.root.findByProps({ testID: 'prevMonth' });
  const next = renderer!.root.findByProps({ testID: 'nextMonth' });
  expect(prev).toBeTruthy();
  expect(next).toBeTruthy();
});

test('AgendaPage renders calendar grid', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => { renderer = renderAgenda(); });
  const grid = renderer!.root.findByProps({ testID: 'calendarGrid' });
  expect(grid).toBeTruthy();
});

test('AgendaPage renders day view button', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => { renderer = renderAgenda(); });
  const btn = renderer!.root.findByProps({ testID: 'dayViewBtn' });
  expect(btn).toBeTruthy();
});

test('AgendaPage renders FAB add button', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => { renderer = renderAgenda(); });
  const fab = renderer!.root.findByProps({ testID: 'fabAddEvent' });
  expect(fab).toBeTruthy();
});

test.skip('AgendaPage shows mock events for today (2026-03-13)', async () => {
  // Skippé : le mock pointe sur 2026-03-13 et la calendar n'affiche que le
  // mois courant. À ré-activer en mockant la date système ou en passant le
  // mock à une date relative (Date.now() + offset).
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => { renderer = renderAgenda(); });
  const text = JSON.stringify(renderer!.toJSON());
  expect(text).toContain('Consultation audioprothésiste');
});

// ── AgendaDayViewPage ──────────────────────────────────────────────────────────

test('AgendaDayViewPage renders without crashing', async () => {
  await ReactTestRenderer.act(async () => { renderDayView(); });
});

test('AgendaDayViewPage displays correct date', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => { renderer = renderDayView(); });
  const dateEl = renderer!.root.findByProps({ testID: 'dayViewDate' });
  expect(dateEl).toBeTruthy();
});

test('AgendaDayViewPage renders navigation arrows', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => { renderer = renderDayView(); });
  expect(renderer!.root.findByProps({ testID: 'prevDay' })).toBeTruthy();
  expect(renderer!.root.findByProps({ testID: 'nextDay' })).toBeTruthy();
});

test.skip('AgendaDayViewPage renders add button', async () => {
  // Skippé : le bouton +Ajouter inline a été retiré de DayView. La création
  // d'événement passe désormais par le tap sur un slot horaire (timelineEvent)
  // ou le FAB de la page Agenda parente. À supprimer ou remplacer par un tap
  // sur slot quand la spec sera fixée.
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => { renderer = renderDayView(); });
  const btn = renderer!.root.findByProps({ testID: 'dayViewAddBtn' });
  expect(btn).toBeTruthy();
});

test('AgendaDayViewPage renders timeline scroll', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => { renderer = renderDayView(); });
  const scroll = renderer!.root.findByProps({ testID: 'timelineScroll' });
  expect(scroll).toBeTruthy();
});

// ── AgendaFormPage ─────────────────────────────────────────────────────────────

test('AgendaFormPage renders in create mode without crashing', async () => {
  await ReactTestRenderer.act(async () => { renderForm(null); });
});

test('AgendaFormPage shows NOUVEAU RDV in create mode', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => { renderer = renderForm(null); });
  expect(JSON.stringify(renderer!.toJSON())).toContain('NOUVEAU RDV');
});

test('AgendaFormPage shows MODIFIER UN RDV in edit mode', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => { renderer = renderForm(MOCK_EDIT_EVENT); });
  expect(JSON.stringify(renderer!.toJSON())).toContain('MODIFIER UN RDV');
});

test('AgendaFormPage renders all key form fields', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => { renderer = renderForm(null); });
  expect(renderer!.root.findByProps({ testID: 'fieldTitle' })).toBeTruthy();
  expect(renderer!.root.findByProps({ testID: 'fieldPro' })).toBeTruthy();
  expect(renderer!.root.findByProps({ testID: 'fieldLocation' })).toBeTruthy();
  expect(renderer!.root.findByProps({ testID: 'fieldDate' })).toBeTruthy();
  expect(renderer!.root.findByProps({ testID: 'fieldStartTime' })).toBeTruthy();
  expect(renderer!.root.findByProps({ testID: 'fieldEndTime' })).toBeTruthy();
  expect(renderer!.root.findByProps({ testID: 'fieldNotes' })).toBeTruthy();
});

test('AgendaFormPage renders save button', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => { renderer = renderForm(null); });
  expect(renderer!.root.findByProps({ testID: 'saveBtn' })).toBeTruthy();
});

test('AgendaFormPage renders delete button only in edit mode', async () => {
  let createRenderer: ReactTestRenderer.ReactTestRenderer;
  let editRenderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => { createRenderer = renderForm(null); });
  await ReactTestRenderer.act(async () => { editRenderer = renderForm(MOCK_EDIT_EVENT); });
  expect(() => createRenderer!.root.findByProps({ testID: 'deleteBtn' })).toThrow();
  expect(editRenderer!.root.findByProps({ testID: 'deleteBtn' })).toBeTruthy();
});

test('AgendaFormPage pre-fills fields in edit mode', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => { renderer = renderForm(MOCK_EDIT_EVENT); });
  const text = JSON.stringify(renderer!.toJSON());
  expect(text).toContain('Consultation audioprothésiste');
  expect(text).toContain('Arnaud DEVEZE');
  expect(text).toContain('09:00');
});
