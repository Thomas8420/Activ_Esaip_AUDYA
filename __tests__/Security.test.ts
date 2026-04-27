/**
 * Tests sécurité — couvre les patchs des commits ac56090, 7b94549, 7689e7d,
 * f6fbc5b, 46ff09d, 570a8ba.
 *
 * Vérifie les invariants critiques qui ne doivent plus régresser :
 * - encodeURIComponent sur les IDs path-interpolés
 * - mappers défensifs face à un backend malveillant/buggé
 * - validations renforcées (NSS, mot de passe, XSS strip)
 * - guard __DEV__ sur les branches mock auth
 */

import {
  validatePassword,
  isValidNumeroSecu,
  stripXSS,
} from '../src/utils/validators';

// ─── Validators — invariants sécu ─────────────────────────────────────────────

describe('validatePassword — règle ANSSI 12 caractères', () => {
  test('rejette tout mot de passe < 12 caractères même conforme aux autres règles', () => {
    expect(validatePassword('Aa1!Short')).toBeTruthy(); // 9 chars
    expect(validatePassword('Aa1!ShortX')).toBeTruthy(); // 10 chars
    expect(validatePassword('Aa1!ShortXY')).toBeTruthy(); // 11 chars
  });

  test('accepte un mot de passe de 12 caractères conformes', () => {
    expect(validatePassword('Aa1!Short123')).toBeNull();
  });
});

describe('isValidNumeroSecu — format français 15 chiffres', () => {
  test('rejette explicitement 13 chiffres (ancien format incorrect)', () => {
    expect(isValidNumeroSecu('1234567890123')).toBe(false);
  });

  test('accepte 15 chiffres', () => {
    expect(isValidNumeroSecu('199056912345678')).toBe(true);
  });
});

describe('stripXSS — strip de balises HTML, pas seulement < >', () => {
  test('retire la balise complète, pas juste les chevrons', () => {
    expect(stripXSS('<script>alert(1)</script>OK')).toBe('alert(1)OK');
  });

  test('retire les guillemets et backticks (XSS attribute injection)', () => {
    expect(stripXSS('a"b`c')).toBe('abc');
  });

  test('idempotent sur du texte sans HTML', () => {
    const input = "L'audition est primordiale — Élise";
    expect(stripXSS(input)).toBe(input);
  });
});

// ─── DEV_SKIP_2FA — garde-fou release ─────────────────────────────────────────

describe('authService — DEV_SKIP_2FA est false', () => {
  test('DEV_SKIP_2FA exporté à false', () => {
    // require() pour éviter le hoisting d'import() dynamique en mode CJS.
    const { DEV_SKIP_2FA } = require('../src/services/authService');
    expect(DEV_SKIP_2FA).toBe(false);
  });
});

// ─── encodeURIComponent — protection contre path traversal / query injection ──

describe('professionalsService.addProfessional — encodage des IDs', () => {
  const mockApiFetch = jest.fn();

  jest.mock('../src/services/api', () => ({
    apiFetch: (...args: unknown[]) => mockApiFetch(...args),
    ApiError: class extends Error {
      status = 0;
      constructor(s: number, m: string) { super(m); this.status = s; }
    },
  }));

  beforeEach(() => mockApiFetch.mockReset());

  test("URL encode un ID hostile contenant '../'", async () => {
    const { addProfessional } = require('../src/services/professionalsService');
    mockApiFetch.mockResolvedValueOnce(undefined);
    await addProfessional('1/../delete');
    const [url] = mockApiFetch.mock.calls[0];
    expect(url).toContain('1%2F..%2Fdelete');
    expect(url).not.toContain('1/../delete');
  });

  test("URL encode un ID contenant un point d'interrogation", async () => {
    const { addProfessional } = require('../src/services/professionalsService');
    mockApiFetch.mockResolvedValueOnce(undefined);
    await addProfessional('99?force=true');
    const [url] = mockApiFetch.mock.calls[0];
    expect(url).toContain('99%3Fforce%3Dtrue');
  });
});

// ─── messagingService.mapMessage — parsing défensif ──────────────────────────

describe('messagingService.mapMessage — parsing défensif', () => {
  test('ne crash pas sur un objet vide', () => {
    const { mapMessage } = require('../src/services/messagingService');
    expect(() => mapMessage({})).not.toThrow();
  });

  test('défaut sur 0 / "" / [] pour un raw {}', () => {
    const { mapMessage } = require('../src/services/messagingService');
    const result = mapMessage({});
    expect(result.id).toBe(0);
    expect(result.isMe).toBe(false);
    expect(result.userName).toBe('');
    expect(result.text).toBe('');
    expect(result.files).toEqual([]);
  });

  test('coerce raw.files=null en tableau vide (ne plante pas sur .map)', () => {
    const { mapMessage } = require('../src/services/messagingService');
    const result = mapMessage({ id: 1, files: null });
    expect(result.files).toEqual([]);
  });

  test('coerce les champs file individuels sur null/undefined', () => {
    const { mapMessage } = require('../src/services/messagingService');
    const result = mapMessage({
      id: 1,
      files: [{ id: null, name: undefined, url: null }],
    });
    expect(result.files[0]).toEqual({ id: 0, name: '', url: '' });
  });
});

// ─── Deeplink reset password — validation scheme/host ────────────────────────
//
// parseResetToken n'est pas exporté — testé indirectement via le module.
// On laisse en TODO un test e2e qui simulerait Linking.openURL pour vérifier
// qu'une URL hostile (`https://evil.example?token=ATTACKER`) ne déclenche pas
// l'écran de réinitialisation. À couvrir quand on aura un mock de Linking.
