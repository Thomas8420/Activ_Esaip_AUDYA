/**
 * Tests unitaires — src/utils/validators.ts
 * Couvre : isValidEmail, maskEmail, validatePassword, isValidNumeroSecu,
 *          stripXSS, sanitizeName, sanitizeZipCode.
 */

import {
  isValidEmail,
  maskEmail,
  validatePassword,
  isValidNumeroSecu,
  stripXSS,
  sanitizeName,
  sanitizeZipCode,
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
  test('accepte un mot de passe valide (12+ chars, majuscule, chiffre, spécial)', () => {
    expect(validatePassword('SecretPass1!')).toBeNull();
    expect(validatePassword('Passw0rd@Long')).toBeNull();
    expect(validatePassword('Abc123!xyz!ZA')).toBeNull();
  });

  test('rejette un mot de passe vide', () => {
    expect(validatePassword('')).toBeTruthy();
  });

  test('rejette un mot de passe trop court (< 12 caractères)', () => {
    const err = validatePassword('Ab1!Short');
    expect(err).toBeTruthy();
    expect(err).toContain('12');
  });

  test('rejette un mot de passe sans majuscule', () => {
    const err = validatePassword('secret1!abcdef');
    expect(err).toBeTruthy();
    expect(err?.toLowerCase()).toContain('majuscule');
  });

  test('rejette un mot de passe sans chiffre', () => {
    const err = validatePassword('SecretAbcdef!');
    expect(err).toBeTruthy();
    expect(err?.toLowerCase()).toContain('chiffre');
  });

  test('rejette un mot de passe sans caractère spécial', () => {
    const err = validatePassword('Secret1234567');
    expect(err).toBeTruthy();
    expect(err?.toLowerCase()).toContain('spécial');
  });

  test('les erreurs de longueur ont priorité sur les autres', () => {
    // Trop court ET sans majuscule/chiffre/spécial
    const err = validatePassword('ab');
    expect(err).toContain('12');
  });
});

// ─── isValidNumeroSecu ────────────────────────────────────────────────────────

describe('isValidNumeroSecu', () => {
  test('accepte un NSS au format 15 chiffres', () => {
    expect(isValidNumeroSecu('123456789012345')).toBe(true);
  });

  test('rejette les longueurs non conformes', () => {
    expect(isValidNumeroSecu('1234567890123')).toBe(false); // 13 chiffres (ancien format)
    expect(isValidNumeroSecu('1234567890123456')).toBe(false); // 16 chiffres
    expect(isValidNumeroSecu('')).toBe(false);
  });

  test('rejette les caractères non numériques', () => {
    expect(isValidNumeroSecu('12345678901234X')).toBe(false);
    expect(isValidNumeroSecu('1234 5678 90123')).toBe(false);
  });
});

// ─── stripXSS ────────────────────────────────────────────────────────────────

describe('stripXSS', () => {
  test('supprime les balises HTML complètes (pas seulement < et >)', () => {
    expect(stripXSS('<script>alert(1)</script>x')).toBe('alert(1)x');
    expect(stripXSS('<img src=x onerror=hack()>texte')).toBe('texte');
  });

  test('supprime les caractères dangereux résiduels', () => {
    expect(stripXSS('hello "world"')).toBe('hello world');
    expect(stripXSS('a`b')).toBe('ab');
  });

  test('préserve le texte normal', () => {
    expect(stripXSS('Bonjour, ça va ?')).toBe('Bonjour, ça va ?');
  });
});

// ─── sanitizeName ────────────────────────────────────────────────────────────

describe('sanitizeName', () => {
  test('autorise lettres, accents, espaces, tirets, apostrophes', () => {
    expect(sanitizeName("Élise d'Aubigné-Marais")).toBe("Élise d'Aubigné-Marais");
    expect(sanitizeName('Jean Müller')).toBe('Jean Müller');
  });

  test('bloque les chiffres et caractères spéciaux', () => {
    expect(sanitizeName('Jean42')).toBe('Jean');
    expect(sanitizeName('<script>')).toBe('script');
    expect(sanitizeName('a@b.com')).toBe('abcom');
  });
});

// ─── sanitizeZipCode ─────────────────────────────────────────────────────────

describe('sanitizeZipCode', () => {
  test('garde uniquement les chiffres', () => {
    expect(sanitizeZipCode('75001')).toBe('75001');
    expect(sanitizeZipCode('75 001')).toBe('75001');
    expect(sanitizeZipCode('SW1A 1AA')).toBe('11'); // UK alphanumérique → digits-only
  });

  test('rejette tout caractère non numérique', () => {
    expect(sanitizeZipCode('abc')).toBe('');
    expect(sanitizeZipCode('<script>1</script>')).toBe('1');
  });
});
