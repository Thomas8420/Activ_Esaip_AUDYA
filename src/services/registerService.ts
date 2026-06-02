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

export interface RegisterStep2Data {
  genre: 'homme' | 'femme';
  dateNaissance: string;
  nom: string;
  prenom: string;
  numeroSecu: string;
  adresse: string;
  complement: string;
  codePostal: string;
  ville: string;
  pays: string;
  telephoneFixe: string;
  telephoneMobile: string;
  profession: string;
}

export interface RegisterStep3Data {
  dureeGene: string;
  ouiNon: string[];
  evolutionSurdite: string;
  situationsDifficiles: string[];
}

export interface RegisterStep4Data {
  profession: string;
  fumeur: boolean;
  taille: string;
  poids: string;
  antecedentsFamiliaux: string;
  antecedentsMedicaux: string;
  antecedentsChirurgicaux: string;
  traitementEnCours: string;
  allergies: string;
  activitePhysique: string;
  remarques: string;
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
    skipAuth: true,
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({email}),
  });
}

// ─── Soumission étape 1 ───────────────────────────────────────────────────────

/** Soumet les données de l'étape 1 (identité, MDP, CGV). */
export async function submitRegistrationStep1(
  data: RegisterStep1Data,
): Promise<void> {
  if (!USE_REGISTER_API) {
    return;
  }
  await apiFetch<void>('/api/register', {
    method: 'POST',
    skipAuth: true,
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

// ─── Soumission étape 2 (informations personnelles) ──────────────────────────

/**
 * Soumet les informations personnelles de l'étape 2.
 * Photo non envoyée ici (TODO : upload séparé via POST /api/patient/profile/photo).
 */
export async function submitRegistrationStep2(
  data: RegisterStep2Data,
): Promise<void> {
  if (!USE_REGISTER_API) {
    return;
  }
  await apiFetch<void>('/api/register/patient-info', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      genre: data.genre,
      date_naissance: data.dateNaissance,
      nom: data.nom,
      prenom: data.prenom,
      numero_secu: data.numeroSecu,
      adresse: data.adresse,
      complement: data.complement,
      code_postal: data.codePostal,
      ville: data.ville,
      pays: data.pays,
      telephone_fixe: data.telephoneFixe,
      telephone_mobile: data.telephoneMobile,
      profession: data.profession,
    }),
  });
}

// ─── Soumission étape 3 (questionnaire auditif) ──────────────────────────────

/** Soumet le questionnaire auditif de l'étape 3. */
export async function submitRegistrationStep3(
  data: RegisterStep3Data,
): Promise<void> {
  if (!USE_REGISTER_API) {
    return;
  }
  await apiFetch<void>('/api/register/hearing-survey', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      duree_gene: data.dureeGene,
      oui_non: data.ouiNon,
      evolution_surdite: data.evolutionSurdite,
      situations_difficiles: data.situationsDifficiles,
    }),
  });
}

// ─── Soumission étape 4 (informations médicales) ─────────────────────────────

/** Soumet les informations médicales de l'étape 4. */
export async function submitRegistrationStep4(
  data: RegisterStep4Data,
): Promise<void> {
  if (!USE_REGISTER_API) {
    return;
  }
  await apiFetch<void>('/api/register/medical-info', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      profession_csp: data.profession,
      smoker: data.fumeur,
      height_cm: data.taille,
      weight_kg: data.poids,
      family_history: data.antecedentsFamiliaux,
      medical_history: data.antecedentsMedicaux,
      surgical_history: data.antecedentsChirurgicaux,
      current_treatment: data.traitementEnCours,
      allergies: data.allergies,
      physical_activity_hours: data.activitePhysique,
      remarks: data.remarques,
    }),
  });
}

// ─── Soumission étape 5 (sélection d'un professionnel) ───────────────────────

/**
 * Associe un professionnel sélectionné parmi les résultats de recherche.
 * Le `consent_data_share` est implicite : l'utilisateur a déjà accepté en
 * cliquant "Je valide" (équivalent à l'écran d'invitation explicite côté
 * AddProfessional). Si l'utilisateur skip cette étape, ne pas appeler.
 */
export async function submitRegistrationStep5(
  professionalId: string | number,
): Promise<void> {
  if (!USE_REGISTER_API) {
    return;
  }
  await apiFetch<void>('/api/register/professional', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      professional_id: professionalId,
      consent_data_share: true,
    }),
  });
}
