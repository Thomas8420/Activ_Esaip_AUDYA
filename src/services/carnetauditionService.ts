import { apiFetch } from './api';

// ─── API response types (snake_case) ─────────────────────────────────────────

export interface DocumentApiResponse {
  id: number;
  author: string;
  created_at: string; // "YYYY-MM-DD HH:mm:ss"
  document_type: string;
  patient_name?: string;
  title?: string;
  description?: string;
  file_url?: string;
}

// ─── App-level types (camelCase) ─────────────────────────────────────────────

export interface AuditionDocument {
  id: number;
  author: string;
  date: string; // "DD/MM/YYYY"
  type: string;
  patientName?: string;
  title?: string;
  description: string;
  side: 'left' | 'right'; // Pour le design de la timeline
}

// ─── Mapping ──────────────────────────────────────────────────────────────────

function mapApiToDocument(raw: DocumentApiResponse): AuditionDocument {
  // Petite logique pour déterminer le côté (on alterne ou selon l'auteur)
  const side = raw.author.toLowerCase().includes('admin') ? 'right' : 'left';

  return {
    id: raw.id,
    author: raw.author,
    date: raw.created_at.split(' ')[0].split('-').reverse().join('/'), // Convertit YYYY-MM-DD en DD/MM/YYYY
    type: raw.document_type,
    patientName: raw.patient_name,
    title: raw.title,
    description: raw.description ?? '',
    side: side,
  };
}

// ─── Mock Data (Tes données de test) ─────────────────────────────────────────

export const MOCK_DOCUMENTS: AuditionDocument[] = [
  {
    id: 1,
    side: 'right',
    author: 'Pierre Wurting - Admin',
    date: '24/03/2025',
    type: 'Note de suivi',
    patientName: 'Roger Duroc',
    description: 'PROCHAIN RDV LE 12/04/2025 CONSULTATION',
  },
  {
    id: 2,
    side: 'left',
    author: 'Vous',
    date: '17/04/2024',
    type: 'CR Orthophonique',
    title: 'CR Orthophonique',
    description: 'Bilan orthophoniste',
  },
  {
    id: 3,
    side: 'left',
    author: 'Vous',
    date: '03/03/2024',
    type: 'Otoscopie',
    title: 'Otoscopie',
    description: 'Otoscopie - Oreille Droite',
  },
];

export const USE_CARNET_API = false;

// ─── Module-level mock store ──────────────────────────────────────────────────

let mockStore: AuditionDocument[] = [...MOCK_DOCUMENTS];

export function getMockDocuments(): AuditionDocument[] {
  return mockStore;
}

export function addMockDocument(doc: AuditionDocument): void {
  mockStore = [doc, ...mockStore]; // On ajoute au début
}

export function removeMockDocument(id: number): void {
  mockStore = mockStore.filter(d => d.id !== id);
}

// ─── API Functions ────────────────────────────────────────────────────────────

export async function fetchDocuments(): Promise<AuditionDocument[]> {
  const raw = await apiFetch<{ documents: DocumentApiResponse[] }>('/my-documents');
  return raw.documents.map(mapApiToDocument);
}

export async function deleteDocument(docId: number): Promise<void> {
  await apiFetch('/documents/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ document_id: docId }),
  });
}