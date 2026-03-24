/**
 * Tests unitaires pour src/utils/agendaHelpers.ts
 */

import { getTodayISO, formatDateISO, buildCalendarGrid } from '../../src/utils/agendaHelpers';

// ─── getTodayISO ──────────────────────────────────────────────────────────────

test('getTodayISO — retourne une chaine au format YYYY-MM-DD', () => {
  const result = getTodayISO();
  expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
});

test("getTodayISO — la date correspond a aujourd'hui", () => {
  const today = new Date();
  const expected = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  expect(getTodayISO()).toBe(expected);
});

// ─── formatDateISO ────────────────────────────────────────────────────────────

test('formatDateISO — formate correctement une date', () => {
  expect(formatDateISO(2026, 0, 1)).toBe('2026-01-01');    // janvier = 0
  expect(formatDateISO(2026, 11, 31)).toBe('2026-12-31');  // décembre = 11
  expect(formatDateISO(2026, 2, 5)).toBe('2026-03-05');    // 05 -> padded
});

// ─── buildCalendarGrid ────────────────────────────────────────────────────────

test('buildCalendarGrid — la taille de la grille est un multiple de 7', () => {
  for (let month = 0; month < 12; month++) {
    const grid = buildCalendarGrid(2026, month);
    expect(grid.length % 7).toBe(0);
  }
});

test('buildCalendarGrid — les jours du mois courant sont marques otherMonth=false', () => {
  // Janvier 2026 = 31 jours
  const grid = buildCalendarGrid(2026, 0);
  const currentMonthDays = grid.filter(c => !c.otherMonth);
  expect(currentMonthDays.length).toBe(31);
  expect(currentMonthDays[0].day).toBe(1);
  expect(currentMonthDays[currentMonthDays.length - 1].day).toBe(31);
});

test('buildCalendarGrid — fevrier 2026 contient 28 jours (non bissextile)', () => {
  const grid = buildCalendarGrid(2026, 1);
  const currentMonthDays = grid.filter(c => !c.otherMonth);
  expect(currentMonthDays.length).toBe(28);
});

test('buildCalendarGrid — le premier jour de la grille est un lundi (offset correct)', () => {
  // Janvier 2026 commence un jeudi -> offset = 3 -> les 3 premieres cellules sont du mois precedent
  const grid = buildCalendarGrid(2026, 0);
  const firstWeekPrevCells = grid.slice(0, 7).filter(c => c.otherMonth);
  expect(firstWeekPrevCells.length).toBe(3);
});

test('buildCalendarGrid — un mois commencant un lundi a zero cellule precedente en semaine 1', () => {
  // Juin 2026 commence un lundi -> 0 cellule de debordement avant le 1
  const grid = buildCalendarGrid(2026, 5); // juin
  // La premiere cellule doit etre le jour 1 du mois courant
  expect(grid[0]).toEqual({ day: 1, otherMonth: false });
});
