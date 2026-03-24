/**
 * Tests unitaires pour src/services/professionalsService.ts
 *
 * Vérifie le mapping snake_case → camelCase et la logique des appels API.
 */

import { fetchMyProfessionals, addProfessional, removeProfessional } from '../../src/services/professionalsService';

const mockApiFetch = jest.fn();
jest.mock('../../src/services/api', () => ({
  apiFetch: (...args: unknown[]) => mockApiFetch(...args),
  ApiError: class ApiError extends Error {
    status: number;
    constructor(status: number, message: string) {
      super(message);
      this.name = 'ApiError';
      this.status = status;
    }
  },
}));

beforeEach(() => {
  mockApiFetch.mockReset();
});

// ─── fetchMyProfessionals ─────────────────────────────────────────────────────

test('fetchMyProfessionals — mappe snake_case vers camelCase', async () => {
  mockApiFetch.mockResolvedValueOnce([
    {
      id: 42,
      first_name: 'Pierre',
      last_name: 'Wurtig',
      email: 'pro@email.com',
      phone: '0600000000',
      specialization: 'Audioprothésiste',
      hospital: 'Clinique AUDYA',
      invitation_status: 'accepted',
    },
  ]);

  const [pro] = await fetchMyProfessionals();

  expect(pro.id).toBe('42');
  expect(pro.firstName).toBe('Pierre');
  expect(pro.lastName).toBe('Wurtig');
  expect(pro.email).toBe('pro@email.com');
  expect(pro.phone).toBe('0600000000');
  expect(pro.specialty).toBe('Audioprothésiste');
  expect(pro.company).toBe('Clinique AUDYA');
  expect(pro.role).toBe('Audioprothésiste');
  expect(pro.isInvitationPending).toBe(false);
});

test('fetchMyProfessionals — isInvitationPending vaut true si invitation_status est pending', async () => {
  mockApiFetch.mockResolvedValueOnce([
    {
      id: 1,
      first_name: 'A',
      last_name: 'B',
      email: 'a@b.com',
      phone: '0600000000',
      specialization: 'ORL',
      hospital: 'H',
      invitation_status: 'pending',
    },
  ]);

  const [pro] = await fetchMyProfessionals();
  expect(pro.isInvitationPending).toBe(true);
});

test("fetchMyProfessionals — retourne un tableau vide si l'API retourne []", async () => {
  mockApiFetch.mockResolvedValueOnce([]);
  const result = await fetchMyProfessionals();
  expect(result).toEqual([]);
});

test("fetchMyProfessionals — appelle le bon endpoint", async () => {
  mockApiFetch.mockResolvedValueOnce([]);
  await fetchMyProfessionals();
  expect(mockApiFetch).toHaveBeenCalledWith('/api/patient/professionals');
});

// ─── addProfessional ──────────────────────────────────────────────────────────

test('addProfessional — appelle le bon endpoint avec la méthode POST', async () => {
  mockApiFetch.mockResolvedValueOnce(undefined);
  await addProfessional('99');
  expect(mockApiFetch).toHaveBeenCalledWith(
    '/patient/professionals/select-id/99',
    expect.objectContaining({ method: 'POST' }),
  );
});

// ─── removeProfessional ───────────────────────────────────────────────────────

test('removeProfessional — appelle le bon endpoint avec pro_id dans le body', async () => {
  mockApiFetch.mockResolvedValueOnce(undefined);
  await removeProfessional('42');

  const [url, options] = mockApiFetch.mock.calls[0];
  expect(url).toBe('/patient/delete-professional');
  expect(options.method).toBe('POST');
  expect(options.body).toContain('pro_id=42');
});
