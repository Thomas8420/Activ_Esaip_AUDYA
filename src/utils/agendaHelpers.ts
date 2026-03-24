/**
 * Utilitaires partagés pour le module Agenda.
 * Extraits de AgendaPage pour être testables indépendamment.
 */

/** Retourne la date du jour au format ISO YYYY-MM-DD */
export function getTodayISO(): string {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

/** Formate une date (année, mois 0-based, jour) au format ISO YYYY-MM-DD */
export function formatDateISO(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/**
 * Construit la grille de 6 semaines (lundi en premier) pour un mois donné.
 *
 * @param year  Année (ex: 2026)
 * @param month Mois 0-based (0 = janvier)
 * @returns Tableau de 35 ou 42 cellules { day, otherMonth }
 */
export function buildCalendarGrid(
  year: number,
  month: number,
): { day: number; otherMonth: boolean }[] {
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0=Sun
  const offset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // Monday-first
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const grid: { day: number; otherMonth: boolean }[] = [];

  for (let i = offset - 1; i >= 0; i--) {
    grid.push({ day: prevMonthDays - i, otherMonth: true });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    grid.push({ day, otherMonth: false });
  }
  while (grid.length % 7 !== 0) {
    grid.push({ day: grid.length - (offset + daysInMonth) + 1, otherMonth: true });
  }

  return grid;
}
