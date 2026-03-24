/**
 * Tests unitaires pour src/services/api.ts
 *
 * Stratégie : mock de `fetch` global — les tests vérifient le comportement
 * du wrapper sans toucher le réseau.
 */

import { apiFetch, ApiError } from '../../src/services/api';

const mockFetch = jest.fn();
(globalThis as unknown as Record<string, unknown>).fetch = mockFetch;

// Stub __DEV__ qui n'existe pas dans Jest (défini par Metro en vrai appli)
(globalThis as unknown as Record<string, unknown>).__DEV__ = true;

beforeEach(() => {
  mockFetch.mockReset();
});

// ─── Succès ───────────────────────────────────────────────────────────────────

test('apiFetch — retourne le JSON parsé quand la réponse est ok', async () => {
  const payload = { id: 1, name: 'Test' };
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve(payload),
  });

  const result = await apiFetch<typeof payload>('/test');
  expect(result).toEqual(payload);
});

test('apiFetch — inclut les headers par défaut', async () => {
  mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) });

  await apiFetch('/test');

  const [, options] = mockFetch.mock.calls[0];
  expect(options.headers).toMatchObject({
    Accept: 'application/json',
    'Accept-Language': 'fr',
    'X-Requested-With': 'XMLHttpRequest',
  });
});

test('apiFetch — credentials include est toujours présent', async () => {
  mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) });

  await apiFetch('/test');

  const [, options] = mockFetch.mock.calls[0];
  expect(options.credentials).toBe('include');
});

test('apiFetch — fusionne les headers personnalisés avec les headers par défaut', async () => {
  mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) });

  await apiFetch('/test', {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  const [, options] = mockFetch.mock.calls[0];
  expect(options.headers).toMatchObject({
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
  });
});

// ─── Erreurs HTTP ─────────────────────────────────────────────────────────────

test('apiFetch — lève ApiError quand response.ok est false (400)', async () => {
  mockFetch.mockResolvedValueOnce({
    ok: false,
    status: 400,
    json: () => Promise.resolve({ message: 'Bad request' }),
  });

  await expect(apiFetch('/test')).rejects.toThrow(ApiError);
});

test('apiFetch — le status de ApiError correspond au code HTTP', async () => {
  mockFetch.mockResolvedValueOnce({
    ok: false,
    status: 422,
    json: () => Promise.resolve({ message: 'Validation error' }),
  });

  let caughtError: unknown;
  try {
    await apiFetch('/test');
  } catch (err) {
    caughtError = err;
  }

  expect((caughtError as ApiError).status).toBe(422);
  expect((caughtError as ApiError).message).toBe('Validation error');
});

test('apiFetch — message générique si la réponse erreur ne contient pas de message', async () => {
  mockFetch.mockResolvedValueOnce({
    ok: false,
    status: 500,
    json: () => Promise.reject(new Error('parse failed')),
  });

  let caughtError: unknown;
  try {
    await apiFetch('/test');
  } catch (err) {
    caughtError = err;
  }

  expect((caughtError as ApiError).message).toBe('Une erreur est survenue. Veuillez réessayer.');
});

// ─── ApiError ─────────────────────────────────────────────────────────────────

test('ApiError — name est "ApiError"', () => {
  const err = new ApiError(404, 'Not found');
  expect(err.name).toBe('ApiError');
  expect(err.status).toBe(404);
  expect(err.message).toBe('Not found');
  expect(err instanceof Error).toBe(true);
});

// ─── Timeout ──────────────────────────────────────────────────────────────────

test('apiFetch — abandonne la requête si elle dépasse 10 secondes', async () => {
  jest.useFakeTimers();

  // Simule un fetch qui ne se résout jamais
  mockFetch.mockImplementationOnce(
    (_url: string, opts: { signal: AbortSignal }) =>
      new Promise((_resolve, reject) => {
        opts.signal.addEventListener('abort', () => reject(new Error('AbortError')));
      }),
  );

  const promise = apiFetch('/slow');
  jest.advanceTimersByTime(10_001);

  await expect(promise).rejects.toThrow();

  jest.useRealTimers();
});
