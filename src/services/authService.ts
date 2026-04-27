import {apiFetch, ApiError} from './api';

// ─── Toggle API ─────────────────────────────────────────────────────────────
// Mettre à true quand le backend est prêt
const USE_API = false;

/**
 * ⚠️ SÉCURITÉ — Bypass 2FA pour les tests locaux uniquement.
 * Laisser à false. Pour tester en local, changer manuellement à true
 * mais NE JAMAIS committer cette valeur à true.
 * En mock (USE_API=false), le code 2FA valide est "123456".
 *
 * Garde-fou : module-level throw si DEV_SKIP_2FA=true atteint un build release.
 */
export const DEV_SKIP_2FA = false;
if (!__DEV__ && (DEV_SKIP_2FA as boolean)) {
  throw new Error('SECURITY: DEV_SKIP_2FA must never be true in a release build.');
}

/**
 * Garde-fou : interdit qu'un build release atterrisse dans une branche mock.
 * Si quelqu'un oublie de passer USE_API à true, le release build refuse
 * d'authentifier au lieu de laisser passer n'importe quel credential.
 */
function ensureMockOnlyInDev(): void {
  if (!__DEV__) {
    throw new ApiError(503, 'Service d\'authentification indisponible.');
  }
}

// ─── Types ──────────────────────────────────────────────────────────────────

export interface LoginResponse {
  message: string;
}

export interface VerifyResponse {
  message: string;
}

// ─── Login - Premier facteur (email + mot de passe) ─────────────────────────

export async function loginStep1(
  email: string,
  password: string,
): Promise<void> {
  if (!USE_API) {
    ensureMockOnlyInDev();
    // Mock : accepte tout en DEV
    return;
  }
  await apiFetch<LoginResponse>('/patient/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: new URLSearchParams({email, password}).toString(),
  });
}

// ─── Login - Second facteur (code 2FA reçu par email) ───────────────────────

export async function loginStep2(code: string): Promise<void> {
  if (!USE_API) {
    ensureMockOnlyInDev();
    // Mock : accepte le code "123456" en DEV
    if (code !== '123456') {
      throw new ApiError(422, 'Le code n\'est pas valide');
    }
    return;
  }
  await apiFetch<VerifyResponse>('/patient/login/verify', {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: new URLSearchParams({second_factor: code}).toString(),
  });
}

// ─── Renvoi du code 2FA ──────────────────────────────────────────────────────

export async function resend2FACode(): Promise<void> {
  if (!USE_API) {
    ensureMockOnlyInDev();
    return;
  }
  await apiFetch<void>('/patient/login/resend', {method: 'POST'});
}

// ─── Déconnexion ─────────────────────────────────────────────────────────────

export async function logout(): Promise<void> {
  if (!USE_API) {
    // Logout est best-effort : on ne lève PAS d'erreur en release ici,
    // sinon le bouton "Se déconnecter" serait inutilisable tant que USE_API=false.
    return;
  }
  // POST plutôt que GET — un GET de logout est CSRF-prone.
  await apiFetch<void>('/logout', {method: 'POST'});
}

// ─── Mot de passe oublié ─────────────────────────────────────────────────────

export async function forgotPassword(email: string): Promise<void> {
  if (!USE_API) {
    ensureMockOnlyInDev();
    return;
  }
  await apiFetch<void>('/patient/forgot-password', {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: new URLSearchParams({email}).toString(),
  });
}

// ─── Réinitialisation du mot de passe ────────────────────────────────────────

export async function resetPassword(
  token: string,
  password: string,
  passwordConfirmation: string,
): Promise<void> {
  if (!USE_API) {
    ensureMockOnlyInDev();
    return;
  }
  await apiFetch<void>('/patient/reset-password', {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: new URLSearchParams({
      token,
      password,
      password_confirmation: passwordConfirmation,
    }).toString(),
  });
}
