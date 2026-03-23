/**
 * Tests unitaires pour src/services/authService.ts
 *
 * En mode mock (USE_API=false), on valide le comportement attendu sans réseau.
 * Le mock "123456" est le code 2FA valide en dev.
 */

import { loginStep1, loginStep2, resend2FACode, logout, forgotPassword } from '../../src/services/authService';
import { ApiError } from '../../src/services/api';

// apiFetch ne doit jamais être appelé quand USE_API=false
jest.mock('../../src/services/api', () => ({
  apiFetch: jest.fn(),
  ApiError: class ApiError extends Error {
    status: number;
    constructor(status: number, message: string) {
      super(message);
      this.name = 'ApiError';
      this.status = status;
    }
  },
}));

// ─── loginStep1 ───────────────────────────────────────────────────────────────

test("loginStep1 (mock) — résout sans erreur pour n'importe quel email/mot de passe", async () => {
  await expect(loginStep1('user@gmail.com', 'anypassword')).resolves.toBeUndefined();
});

// ─── loginStep2 ───────────────────────────────────────────────────────────────

test('loginStep2 (mock) — résout avec le code "123456"', async () => {
  await expect(loginStep2('123456')).resolves.toBeUndefined();
});

test('loginStep2 (mock) — leve ApiError avec le code incorrect', async () => {
  await expect(loginStep2('000000')).rejects.toThrow(ApiError);
});

test('loginStep2 (mock) — message erreur pour code invalide', async () => {
  let caughtError: unknown;
  try {
    await loginStep2('999999');
  } catch (err) {
    caughtError = err;
  }
  expect((caughtError as ApiError).status).toBe(422);
  expect((caughtError as ApiError).message).toMatch(/pas valide/i);
});

test('loginStep2 (mock) — code vide leve ApiError', async () => {
  await expect(loginStep2('')).rejects.toThrow(ApiError);
});

// ─── resend2FACode ────────────────────────────────────────────────────────────

test('resend2FACode (mock) — résout sans erreur', async () => {
  await expect(resend2FACode()).resolves.toBeUndefined();
});

// ─── logout ───────────────────────────────────────────────────────────────────

test('logout (mock) — résout sans erreur', async () => {
  await expect(logout()).resolves.toBeUndefined();
});

// ─── forgotPassword ───────────────────────────────────────────────────────────

test("forgotPassword (mock) — résout sans erreur pour n'importe quel email", async () => {
  await expect(forgotPassword('user@gmail.com')).resolves.toBeUndefined();
});
