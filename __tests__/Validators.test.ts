/**
 * Tests unitaires — src/utils/validators.ts
 * Couvre : isValidEmail, maskEmail, validatePassword
 */

import {
  isValidEmail,
  maskEmail,
  validatePassword,
  ALLOWED_EMAIL_DOMAINS,
} from '../src/utils/validators';

// ─── isValidEmail ─────────────────────────────────────────────────────────────

describe('isValidEmail', () => {
  test('accepte les domaines autorisés', () => {
    expect(isValidEmail('user@gmail.com')).toBe(true);
    expect(isValidEmail('user@outlook.fr')).toBe(true);
    expect(isValidEmail('user@orange.fr')).toBe(true);
    expect(isValidEmail('user@protonmail.com')).toBe(true);
  });

  test('rejette les domaines non autorisés', () => {
    expect(isValidEmail('user@unknown-domain.com')).toBe(false);
    expect(isValidEmail('user@company.fr')).toBe(false);
    expect(isValidEmail('user@test.io')).toBe(false);
  });

  test('rejette les emails mal formés', () => {
    expect(isValidEmail('notanemail')).toBe(false);
    expect(isValidEmail('@gmail.com')).toBe(false);
    expect(isValidEmail('user@')).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });

  test('est insensible à la casse du domaine', () => {
    expect(isValidEmail('user@GMAIL.COM')).toBe(true);
    expect(isValidEmail('user@Gmail.Com')).toBe(true);
  });

  test('ALLOWED_EMAIL_DOMAINS contient les principaux fournisseurs français', () => {
    const required = ['gmail.com', 'outlook.fr', 'orange.fr', 'yahoo.fr', 'laposte.net'];
    required.forEach(domain => {
      expect(ALLOWED_EMAIL_DOMAINS).toContain(domain);
    });
  });
});

// ─── maskEmail ────────────────────────────────────────────────────────────────

describe('maskEmail', () => {
  test('masque la partie locale en conservant 2 caractères visibles', () => {
    const result = maskEmail('jean@gmail.com');
    expect(result).toMatch(/^je/);
    expect(result).toContain('@gmail.com');
    expect(result).toContain('*');
  });

  test('préserve le domaine tel quel', () => {
    expect(maskEmail('thomas@orange.fr')).toContain('@orange.fr');
  });

  test('retourne une chaîne vide si email vide', () => {
    expect(maskEmail('')).toBe('');
  });

  test('gère les emails avec partie locale très courte', () => {
    const result = maskEmail('ab@gmail.com');
    expect(result).toContain('@gmail.com');
  });

  test('ne révèle pas la totalité de la partie locale', () => {
    const result = maskEmail('secret.name@gmail.com');
    expect(result).not.toContain('secret.name');
    expect(result).toContain('@gmail.com');
  });

  test('retourne "***" si pas de "@"', () => {
    expect(maskEmail('notanemail')).toBe('***');
  });
});

// ─── validatePassword ─────────────────────────────────────────────────────────

describe('validatePassword', () => {
  test('accepte un mot de passe valide (8+ chars, majuscule, chiffre, spécial)', () => {
    expect(validatePassword('Secret1!')).toBeNull();
    expect(validatePassword('Passw0rd@')).toBeNull();
    expect(validatePassword('Abc123!xyz')).toBeNull();
  });

  test('rejette un mot de passe vide', () => {
    expect(validatePassword('')).toBeTruthy();
  });

  test('rejette un mot de passe trop court (< 8 caractères)', () => {
    const err = validatePassword('Ab1!');
    expect(err).toBeTruthy();
    expect(err).toContain('8');
  });

  test('rejette un mot de passe sans majuscule', () => {
    const err = validatePassword('secret1!abc');
    expect(err).toBeTruthy();
    expect(err?.toLowerCase()).toContain('majuscule');
  });

  test('rejette un mot de passe sans chiffre', () => {
    const err = validatePassword('SecretAbc!');
    expect(err).toBeTruthy();
    expect(err?.toLowerCase()).toContain('chiffre');
  });

  test('rejette un mot de passe sans caractère spécial', () => {
    const err = validatePassword('Secret123');
    expect(err).toBeTruthy();
    expect(err?.toLowerCase()).toContain('spécial');
  });

  test('les erreurs de longueur ont priorité sur les autres', () => {
    // Trop court ET sans majuscule/chiffre/spécial
    const err = validatePassword('ab');
    expect(err).toContain('8');
  });
});
