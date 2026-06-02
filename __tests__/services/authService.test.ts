/**
 * Tests unitaires — src/services/authService.ts
 *
 * Couvre le flux Sanctum 3-temps : login (pending_token) → verify-2fa (token + user)
 * → logout. apiFetch est mocké pour découpler de la couche réseau réelle.
 */

import {
  loginStep1,
  loginStep2,
  resend2FACode,
  logout,
} from '../../src/services/authService';

jest.mock('../../src/services/api', () => {
  const actualApi = jest.requireActual('../../src/services/api');
  return {
    ...actualApi,
    apiFetch: jest.fn(),
    setAuthToken: jest.fn(),
  };
});

import {apiFetch, setAuthToken, ApiError} from '../../src/services/api';
import {
  getStoredAuthToken,
  getStoredUser,
  clearAuthStorage,
} from '../../src/services/secureStorage';

const apiFetchMock = apiFetch as jest.MockedFunction<typeof apiFetch>;
const setAuthTokenMock = setAuthToken as jest.MockedFunction<typeof setAuthToken>;

beforeEach(async () => {
  // Reset du state module-level (pendingToken) via un logout silencieux —
  // authService garde le pending_token en mémoire entre les étapes 1 et 2.
  apiFetchMock.mockResolvedValueOnce(undefined as never);
  await logout();
  apiFetchMock.mockReset();
  setAuthTokenMock.mockReset();
  await clearAuthStorage();
});

// ─── loginStep1 ──────────────────────────────────────────────────────────────

describe('loginStep1', () => {
  test('POST /api/auth/login et conserve le pending_token', async () => {
    apiFetchMock.mockResolvedValueOnce({pending_token: 'pt-abc'} as never);

    await expect(
      loginStep1('user@gmail.com', 'pwd'),
    ).resolves.toBeUndefined();

    expect(apiFetchMock).toHaveBeenCalledWith(
      '/api/auth/login',
      expect.objectContaining({
        method: 'POST',
        skipAuth: true,
        body: JSON.stringify({email: 'user@gmail.com', password: 'pwd'}),
      }),
    );
  });

  test('lève une erreur si pending_token absent de la réponse', async () => {
    apiFetchMock.mockResolvedValueOnce({} as never);
    await expect(loginStep1('a@b.com', 'x')).rejects.toBeInstanceOf(ApiError);
  });

  test('propage l\'ApiError 401 du backend', async () => {
    apiFetchMock.mockRejectedValueOnce(new ApiError(401, 'Identifiants invalides.'));
    await expect(loginStep1('a@b.com', 'wrong')).rejects.toMatchObject({status: 401});
  });
});

// ─── loginStep2 ──────────────────────────────────────────────────────────────

describe('loginStep2', () => {
  test('échoue avec 409 sans pending_token préalable', async () => {
    await expect(loginStep2('123456')).rejects.toMatchObject({status: 409});
  });

  test('persiste token + user dans le storage et propage à api.setAuthToken', async () => {
    apiFetchMock.mockResolvedValueOnce({pending_token: 'pt-abc'} as never);
    await loginStep1('user@gmail.com', 'pwd');

    apiFetchMock.mockResolvedValueOnce({
      token: 'sanctum-token-xyz',
      user: {id: 42, email: 'user@gmail.com', first_name: 'Marie', last_name: 'Dupont'},
    } as never);

    await loginStep2('123456');

    expect(setAuthTokenMock).toHaveBeenCalledWith('sanctum-token-xyz');
    await expect(getStoredAuthToken()).resolves.toBe('sanctum-token-xyz');
    await expect(getStoredUser()).resolves.toMatchObject({
      id: 42,
      email: 'user@gmail.com',
      firstName: 'Marie',
      lastName: 'Dupont',
    });
  });

  test('code 2FA invalide → propage l\'ApiError 422 du backend', async () => {
    apiFetchMock.mockResolvedValueOnce({pending_token: 'pt-abc'} as never);
    await loginStep1('user@gmail.com', 'pwd');

    apiFetchMock.mockRejectedValueOnce(new ApiError(422, 'Le code n\'est pas valide'));
    await expect(loginStep2('000000')).rejects.toMatchObject({status: 422});
  });
});

// ─── resend2FACode ───────────────────────────────────────────────────────────

describe('resend2FACode', () => {
  test('échoue avec 409 sans pending_token préalable', async () => {
    await expect(resend2FACode()).rejects.toMatchObject({status: 409});
  });

  test('POST /api/auth/resend-code avec le pending_token courant', async () => {
    apiFetchMock.mockResolvedValueOnce({pending_token: 'pt-abc'} as never);
    await loginStep1('user@gmail.com', 'pwd');

    apiFetchMock.mockResolvedValueOnce(undefined as never);
    await resend2FACode();

    expect(apiFetchMock).toHaveBeenLastCalledWith(
      '/api/auth/resend-code',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({pending_token: 'pt-abc'}),
      }),
    );
  });
});

// ─── logout ──────────────────────────────────────────────────────────────────

describe('logout', () => {
  test('appelle POST /api/auth/logout et nettoie le storage', async () => {
    apiFetchMock.mockResolvedValueOnce(undefined as never);
    await logout();

    expect(apiFetchMock).toHaveBeenCalledWith('/api/auth/logout', {method: 'POST'});
    expect(setAuthTokenMock).toHaveBeenCalledWith(null);
    await expect(getStoredAuthToken()).resolves.toBeNull();
    await expect(getStoredUser()).resolves.toBeNull();
  });

  test('nettoie le storage même si l\'appel backend échoue', async () => {
    apiFetchMock.mockRejectedValueOnce(new ApiError(401, 'expired'));
    await expect(logout()).resolves.toBeUndefined();

    expect(setAuthTokenMock).toHaveBeenCalledWith(null);
    await expect(getStoredAuthToken()).resolves.toBeNull();
  });
});
