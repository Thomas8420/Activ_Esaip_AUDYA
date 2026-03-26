import { apiFetch } from './api';

/** Passer à true dès que GET /api/patient/health est disponible */
export const USE_HEALTH_API = false;

// ─── API response types (snake_case — format backend) ─────────────────────────

export interface PatientHealthApiResponse {
  full_name: string;
  age: number;
  gender: 'Homme' | 'Femme';
  address_line: string;
  city_zip: string;
  bmi: number;
  sex: 'Homme' | 'Femme';
  smoker: 'Oui' | 'Non';
  height_cm: number;
  weight_kg: number;
  family_history: string;
  medical_history: string[];
  surgical_history: string[];
  medications: string[];
  allergies: string[];
  physical_activity_hours: string;
  documents: string[];
}

// ─── App-level types (camelCase) ─────────────────────────────────────────────

export interface PatientHealth {
  fullName: string;
  age: number;
  gender: 'Homme' | 'Femme';
  addressLine: string;
  cityZip: string;
  bmi: number;
  sex: string;
  smoker: string;
  heightCm: number;
  weightKg: number;
  familyHistory: string;
  medicalHistory: string[];
  surgicalHistory: string[];
  medications: string[];
  allergies: string[];
  physicalActivityHours: string;
  documents: string[];
}

// ─── Mapping snake_case → camelCase ──────────────────────────────────────────

export function mapApiToPatientHealth(raw: PatientHealthApiResponse): PatientHealth {
  return {
    fullName: raw.full_name,
    age: raw.age,
    gender: raw.gender,
    addressLine: raw.address_line,
    cityZip: raw.city_zip,
    bmi: raw.bmi,
    sex: raw.sex,
    smoker: raw.smoker,
    heightCm: raw.height_cm,
    weightKg: raw.weight_kg,
    familyHistory: raw.family_history,
    medicalHistory: raw.medical_history,
    surgicalHistory: raw.surgical_history,
    medications: raw.medications,
    allergies: raw.allergies,
    physicalActivityHours: raw.physical_activity_hours,
    documents: raw.documents,
  };
}

// ─── API functions ────────────────────────────────────────────────────────────

/**
 * GET /api/patient/health
 * TODO: endpoint non encore disponible côté backend
 */
export async function fetchPatientHealth(): Promise<PatientHealth> {
  const raw = await apiFetch<PatientHealthApiResponse>('/api/patient/health');
  return mapApiToPatientHealth(raw);
}

