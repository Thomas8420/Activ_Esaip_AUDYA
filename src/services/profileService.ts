import { apiFetch } from './api';

// ─── API response types (snake_case — format backend) ─────────────────────────

export interface PatientProfileApiResponse {
  id: string;
  gender: 'homme' | 'femme';
  birth_date: string;
  last_name: string;
  first_name: string;
  phone: string;
  address: string;
  address_complement: string;
  zip_code: string;
  city: string;
  country: string;
  phone_fax: string;
  email: string;
  profile_picture_url: string | null;
}

// ─── App-level types (camelCase) ─────────────────────────────────────────────

export interface PatientProfile {
  id: string;
  gender: 'homme' | 'femme';
  birthDate: string;
  lastName: string;
  firstName: string;
  phone: string;
  address: string;
  addressComplement: string;
  zipCode: string;
  city: string;
  country: string;
  phoneFax: string;
  email: string;
  profilePictureUrl: string | null;
}

// ─── Mapping snake_case → camelCase ──────────────────────────────────────────

export function mapApiToPatientProfile(raw: PatientProfileApiResponse): PatientProfile {
  return {
    id: raw.id,
    gender: raw.gender,
    birthDate: raw.birth_date,
    lastName: raw.last_name,
    firstName: raw.first_name,
    phone: raw.phone,
    address: raw.address,
    addressComplement: raw.address_complement,
    zipCode: raw.zip_code,
    city: raw.city,
    country: raw.country,
    phoneFax: raw.phone_fax,
    email: raw.email,
    profilePictureUrl: raw.profile_picture_url,
  };
}

// ─── API Functions ────────────────────────────────────────────────────────────

/**
 * GET /api/patient/profile
 * TODO: endpoint non encore disponible côté backend
 */
export async function fetchPatientProfile(): Promise<PatientProfile> {
  const raw = await apiFetch<PatientProfileApiResponse>('/api/patient/profile');
  return mapApiToPatientProfile(raw);
}

/**
 * POST /api/patient/profile/photo
 * Upload une nouvelle photo de profil (multipart/form-data).
 * Retourne l'URL publique de la photo enregistrée.
 * TODO: endpoint non encore disponible côté backend
 */
export async function uploadProfilePhoto(
  uri: string,
  type: string,
  name: string,
): Promise<string> {
  const formData = new FormData();
  // React Native accepte un objet { uri, type, name } dans FormData
  // React Native's fetch accepts { uri, type, name } as a file object in FormData
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (formData as any).append('photo', { uri, type, name });
  const response = await apiFetch<{ profile_picture_url: string }>(
    '/api/patient/profile/photo',
    {
      method: 'POST',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      body: formData as any,
    },
  );
  return response.profile_picture_url;
}

/**
 * PATCH /api/patient/profile
 * TODO: endpoint non encore disponible côté backend
 */
export async function updatePatientProfile(profile: PatientProfile): Promise<void> {
  await apiFetch('/api/patient/profile', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      gender: profile.gender,
      birth_date: profile.birthDate,
      last_name: profile.lastName,
      first_name: profile.firstName,
      phone: profile.phone,
      address: profile.address,
      address_complement: profile.addressComplement,
      zip_code: profile.zipCode,
      city: profile.city,
      country: profile.country,
      phone_fax: profile.phoneFax,
      email: profile.email,
    }),
  });
}
