import {apiFetch, ApiError} from './api';

// ─── Toggle API ─────────────────────────────────────────────────────────────
// Mettre à true quand le backend est prêt
const USE_API = false;

/**
 * En mode mock (USE_API = false), passe la vérification 2FA automatiquement.
 * Mettre à false en production (géré automatiquement via USE_API).
 */
export const DEV_SKIP_2FA = __DEV__ && !USE_API;

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
    return;
  }
  await apiFetch<void>('/patient/login/resend', {method: 'POST'});
}

// ─── Déconnexion ─────────────────────────────────────────────────────────────

export async function logout(): Promise<void> {
  if (!USE_API) {
    return;
  }
  await apiFetch<void>('/logout', {method: 'GET'});
}

// ─── Mot de passe oublié ─────────────────────────────────────────────────────

export async function forgotPassword(email: string): Promise<void> {
  if (!USE_API) {
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
