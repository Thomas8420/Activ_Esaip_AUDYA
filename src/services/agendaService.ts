import { apiFetch } from './api';

// ─── API response types (snake_case) ─────────────────────────────────────────

export interface EventApiResponse {
  id: number;
  title: string;
  type: string;
  start: string;
  end: string;
  patient_id?: number;
  patient_name?: string;
  location?: string;
  description?: string;
  backgroundColor?: string;
}

// ─── App-level types (camelCase) ─────────────────────────────────────────────

export interface AgendaEvent {
  id: number;
  title: string;
  type: string;
  /** "YYYY-MM-DD HH:mm" */
  start: string;
  /** "YYYY-MM-DD HH:mm" */
  end: string;
  location: string;
  notes: string;
  professionalName: string;
  backgroundColor: string;
}

export interface CreateEventParams {
  title: string;
  type: string;
  /** "YYYY-MM-DD HH:mm" */
  start: string;
  /** "YYYY-MM-DD HH:mm" */
  end: string;
  location: string;
  notes: string;
  professionalName: string;
}

// ─── Mapping ──────────────────────────────────────────────────────────────────

function mapApiToEvent(raw: EventApiResponse): AgendaEvent {
  return {
    id: raw.id,
    title: raw.title,
    type: raw.type,
    start: raw.start.slice(0, 16),
    end: raw.end.slice(0, 16),
    location: raw.location ?? '',
    notes: raw.description ?? '',
    professionalName: raw.patient_name ?? '',
    backgroundColor: raw.backgroundColor ?? '#3ABFBF',
  };
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const MOCK_EVENTS: AgendaEvent[] = [
  {
    id: 1,
    title: 'Consultation audioprothésiste',
    type: 'consultation',
    start: '2026-03-13 09:00',
    end: '2026-03-13 09:30',
    location: 'Cabinet Arnaud DEVEZE - Lyon',
    notes: 'Contrôle annuel appareillage',
    professionalName: 'Arnaud DEVEZE',
    backgroundColor: '#3ABFBF',
  },
  {
    id: 2,
    title: 'Bilan auditif',
    type: 'test',
    start: '2026-03-13 14:00',
    end: '2026-03-13 15:00',
    location: 'Clinique Saint-Luc - Lyon',
    notes: 'Apporter les anciens résultats',
    professionalName: 'Marie DUPONT',
    backgroundColor: '#E8622A',
  },
  {
    id: 3,
    title: 'Réglage prothèse',
    type: 'appointment',
    start: '2026-03-16 10:30',
    end: '2026-03-16 11:00',
    location: 'Cabinet Arnaud DEVEZE - Lyon',
    notes: '',
    professionalName: 'Arnaud DEVEZE',
    backgroundColor: '#3ABFBF',
  },
  {
    id: 4,
    title: 'Suivi ORL',
    type: 'consultation',
    start: '2026-03-18 11:00',
    end: '2026-03-18 11:45',
    location: 'Hôpital Edouard Herriot',
    notes: 'Résultats audiogramme à apporter',
    professionalName: 'Dr. Pierre MARTIN',
    backgroundColor: '#42A5F5',
  },
  {
    id: 5,
    title: 'Audiogramme tonal',
    type: 'test',
    start: '2026-03-20 08:30',
    end: '2026-03-20 09:30',
    location: 'Clinique Saint-Luc - Lyon',
    notes: '',
    professionalName: 'Marie DUPONT',
    backgroundColor: '#E8622A',
  },
  {
    id: 6,
    title: 'Livraison prothèse',
    type: 'appointment',
    start: '2026-03-24 15:00',
    end: '2026-03-24 16:00',
    location: 'Cabinet Arnaud DEVEZE - Lyon',
    notes: 'Premier essai nouvelle prothèse',
    professionalName: 'Arnaud DEVEZE',
    backgroundColor: '#3ABFBF',
  },
  {
    id: 7,
    title: 'Consultation généraliste',
    type: 'consultation',
    start: '2026-03-27 09:30',
    end: '2026-03-27 10:00',
    location: 'Cabinet Dr. LEBLANC',
    notes: 'Renouvellement ordonnance',
    professionalName: 'Dr. LEBLANC',
    backgroundColor: '#66BB6A',
  },
  {
    id: 8,
    title: "Bilan d'adaptation",
    type: 'test',
    start: '2026-04-03 14:30',
    end: '2026-04-03 15:30',
    location: 'Cabinet Arnaud DEVEZE - Lyon',
    notes: "Bilan après 1 mois d'appareillage",
    professionalName: 'Arnaud DEVEZE',
    backgroundColor: '#3ABFBF',
  },
];

/** Passer à true dès que les endpoints /events et /my-events sont disponibles */
export const USE_AGENDA_API = false;

// ─── Module-level mock store (persiste entre les navigations en mode mock) ────

let mockStore: AgendaEvent[] = [...MOCK_EVENTS];

export function getMockEvents(): AgendaEvent[] {
  return mockStore;
}

export function addMockEvent(event: AgendaEvent): void {
  mockStore = [...mockStore, event];
}

export function updateMockEvent(event: AgendaEvent): void {
  mockStore = mockStore.map(e => (e.id === event.id ? event : e));
}

export function removeMockEvent(id: number): void {
  mockStore = mockStore.filter(e => e.id !== id);
}

// ─── API Functions ────────────────────────────────────────────────────────────

export async function fetchEvents(): Promise<AgendaEvent[]> {
  const raw = await apiFetch<{ events: EventApiResponse[] }>('/my-events');
  return raw.events.map(mapApiToEvent);
}

export async function createEvent(params: CreateEventParams): Promise<number> {
  const raw = await apiFetch<{ event_id: number }>('/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: params.title,
      type: params.type,
      start: `${params.start}:00`,
      end: `${params.end}:00`,
      location: params.location,
      description: params.notes,
    }),
  });
  return raw.event_id;
}

export async function deleteEvent(eventId: number): Promise<void> {
  await apiFetch('/events/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event_id: eventId }),
  });
}
