import { apiFetch } from './api';

/** Passer à true dès que GET /api/patient/professionals est disponible */
export const USE_PROFESSIONALS_API = false;

/**
 * Structure d'un professionnel telle que retournée par l'API.
 * Champs en snake_case conformément à la convention du backend Laravel.
 *
 * ⚠️  L'endpoint JSON n'est pas encore documenté.
 *     En attente de : GET /api/patient/professionals
 *     Actuellement, GET /patient/professionals retourne du HTML (non utilisable en mobile).
 */
export interface ProfessionalApiResponse {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  specialization: string;
  hospital: string;
  /** Statut de l'invitation — champ à confirmer avec le backend */
  invitation_status?: 'pending' | 'accepted' | 'rejected';
}

/**
 * Structure utilisée dans l'application (camelCase).
 */
export interface Professional {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialty: string;
  company: string;
  role: string;
  isFavorite: boolean;
  isInvitationPending: boolean;
  /** Champs supplémentaires à confirmer avec le backend */
  zipCode: string;
  city: string;
}

/**
 * Convertit la réponse API (snake_case) vers le type app (camelCase).
 */
function mapApiToProfessional(pro: ProfessionalApiResponse): Professional {
  return {
    id: String(pro.id),
    firstName: pro.first_name,
    lastName: pro.last_name,
    email: pro.email,
    phone: pro.phone,
    specialty: pro.specialization,
    company: pro.hospital,
    role: pro.specialization,
    isFavorite: false, // ⚠️ Pas d'endpoint favoris documenté — à implémenter
    isInvitationPending: pro.invitation_status === 'pending',
    zipCode: '',        // ⚠️ Champ absent de l'API — à confirmer
    city: '',           // ⚠️ Champ absent de l'API — à confirmer
  };
}

/**
 * Récupère la liste des professionnels associés au patient connecté.
 *
 * ⚠️  Endpoint non encore disponible en JSON.
 *     À remplacer par : GET /api/patient/professionals
 */
export async function fetchMyProfessionals(): Promise<Professional[]> {
  const data = await apiFetch<ProfessionalApiResponse[]>(
    '/api/patient/professionals',
  );
  return data.map(mapApiToProfessional);
}

/**
 * Ajoute un professionnel à l'équipe de soins du patient.
 * POST /patient/professionals/select-id/{professional_id}
 */
export async function addProfessional(professionalId: string): Promise<void> {
  await apiFetch(`/patient/professionals/select-id/${encodeURIComponent(professionalId)}`, {
    method: 'POST',
  });
}

/**
 * Supprime un professionnel de l'équipe de soins du patient.
 * POST /patient/delete-professional
 */
export async function removeProfessional(professionalId: string): Promise<void> {
  await apiFetch('/patient/delete-professional', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ pro_id: professionalId }).toString(),
  });
}
