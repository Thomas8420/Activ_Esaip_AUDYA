import {apiFetch} from './api';

// ─── Toggle API ──────────────────────────────────────────────────────────────
const USE_REGISTER_API = false; // Passer à true quand les endpoints backend sont prêts

// ─── Types ───────────────────────────────────────────────────────────────────

export interface RegisterStep1Data {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  cgv: boolean;
  contact: 'oui' | 'non';
}

// ─── Renvoi de l'email de vérification ───────────────────────────────────────

/**
 * Renvoie l'email de vérification à l'adresse fournie.
 * Appelé depuis RegisterStep1BisPage — ne déclenche PAS de navigation.
 */
export async function resendVerificationEmail(email: string): Promise<void> {
  if (!USE_REGISTER_API) {
    return;
  }
  await apiFetch<void>('/api/register/verify-email', {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: new URLSearchParams({email}).toString(),
  });
}

// ─── Soumission étape 1 ───────────────────────────────────────────────────────

/**
 * Soumet les données de l'étape 1 (identité, MDP, CGV).
 * TODO: brancher quand l'endpoint POST /api/register est confirmé.
 */
export async function submitRegistrationStep1(
  data: RegisterStep1Data,
): Promise<void> {
  if (!USE_REGISTER_API) {
    return;
  }
  await apiFetch<void>('/api/register', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      nom: data.nom,
      prenom: data.prenom,
      email: data.email,
      mot_de_passe: data.motDePasse,
      cgv: data.cgv,
      contact: data.contact,
    }),
  });
}
