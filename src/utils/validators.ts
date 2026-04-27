// Domaines email autorisés dans l'application
export const ALLOWED_EMAIL_DOMAINS = [
  'gmail.com',
  'outlook.com', 'outlook.fr', 'hotmail.com', 'hotmail.fr', 'live.com', 'live.fr', 'msn.com',
  'orange.fr', 'orange.com',
  'yahoo.com', 'yahoo.fr',
  'icloud.com', 'me.com',
  'protonmail.com', 'pm.me',
  'laposte.net', 'sfr.fr', 'free.fr', 'wanadoo.fr', 'bbox.fr',
];

// Vérifie que l'email est valide ET appartient à un domaine autorisé
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return false;
  const domain = email.split('@')[1]?.toLowerCase();
  return ALLOWED_EMAIL_DOMAINS.includes(domain);
};

/**
 * Masque l'email pour l'affichage public.
 * Ex: jean.dupont@gmail.com → je****@gmail.com
 */
export const maskEmail = (email: string): string => {
  if (!email) return '';
  const atIndex = email.indexOf('@');
  if (atIndex < 0) return '***';
  const local = email.slice(0, atIndex);
  const domain = email.slice(atIndex + 1);
  if (local.length <= 2) return `${local}***@${domain}`;
  const masked = '*'.repeat(Math.min(4, local.length - 2));
  return `${local.slice(0, 2)}${masked}@${domain}`;
};

/**
 * Valide la complexité d'un mot de passe.
 * Retourne un message d'erreur ou null si le mot de passe est valide.
 * Règles ANSSI 2024 (données de santé) : >= 12 caractères, 1 majuscule, 1 chiffre,
 * 1 caractère spécial.
 */
export const validatePassword = (password: string): string | null => {
  if (!password) return ERROR_MESSAGES.PASSWORD_REQUIRED;
  if (password.length < 12) return ERROR_MESSAGES.PASSWORD_TOO_SHORT;
  if (!/[A-Z]/.test(password)) return 'Le mot de passe doit contenir au moins une majuscule';
  if (!/\d/.test(password)) return 'Le mot de passe doit contenir au moins un chiffre';
  if (!/[^A-Za-z0-9]/.test(password)) return 'Le mot de passe doit contenir au moins un caractère spécial';
  return null;
};

/**
 * Valide un numéro de sécurité sociale français (15 chiffres : 13 NIR + 2 clé).
 * Retourne true si le format est valide. La validation de la clé Luhn-like
 * doit être faite côté backend (97 - (NIR mod 97) = clé).
 */
export const isValidNumeroSecu = (value: string): boolean =>
  /^\d{15}$/.test(value);

export const ERROR_MESSAGES = {
  EMAIL_REQUIRED: "L'email est requis",
  EMAIL_INVALID: 'Veuillez utiliser une adresse Gmail, Outlook, Orange, Yahoo ou similaire',
  PASSWORD_REQUIRED: 'Le mot de passe est requis', // NOSONAR
  PASSWORD_TOO_SHORT: 'Minimum 12 caractères', // NOSONAR
  PASSWORD_MISMATCH: 'Les mots de passe ne correspondent pas', // NOSONAR
};

// ─── Sanitisation des entrées utilisateur ────────────────────────────────────

/**
 * Retire les balises HTML et caractères dangereux susceptibles de servir à du
 * stored XSS si la donnée est ré-affichée dans une interface web (back-office
 * professionnel par exemple). Le client RN n'évalue pas le HTML, mais cette
 * sanitisation protège les consommateurs en aval.
 */
export const stripXSS = (value: string): string =>
  value.replace(/<[^>]*>/g, '').replace(/[<>"`]/g, '');

/**
 * Sanitise un champ nom/prénom/ville.
 * Autorise uniquement : lettres (Latin + accents Western Europe), espaces, tirets, apostrophes.
 * Bloque : chiffres, <, > et tout autre caractère spécial (protection XSS + cohérence métier).
 */
export const sanitizeName = (value: string): string =>
  value.replace(/[^a-zA-ZÀ-ÖØ-öø-ÿœŒ\s'\-]/g, '');

/**
 * Sanitise un champ texte libre (messages, notes, antécédents).
 * Retire les balises HTML complètes et les caractères XSS.
 */
export const sanitizeText = (value: string): string =>
  value.replace(/<[^>]*>/g, '').replace(/[<>]/g, '');

/**
 * Sanitise un numéro de téléphone.
 * Autorise : chiffres, +, -, espaces, (, ), #, *
 * Bloque tout le reste.
 */
export const sanitizePhone = (value: string): string =>
  value.replace(/[^0-9+\-\s().#*]/g, '');

/**
 * Sanitise un code postal (France + pays francophones).
 * Autorise : chiffres uniquement (FR: 75001, BE: 1000, CH: 8001, LU: 1234).
 * Bloque : lettres et tout autre caractère — protection XSS + cohérence métier.
 */
export const sanitizeZipCode = (value: string): string =>
  value.replace(/[^0-9]/g, '');

/**
 * Sanitise un champ purement numérique (taille en cm, poids en kg, heures).
 * Autorise : chiffres uniquement.
 */
export const sanitizeNumeric = (value: string): string =>
  value.replace(/[^0-9]/g, '');

/**
 * Sanitise un champ email.
 * Retire les caractères dangereux tout en préservant la structure email valide.
 */
export const sanitizeEmail = (value: string): string =>
  value.replace(/[<>'";\s]/g, '');

/**
 * Sanitise un champ date sous forme texte (DD/MM/YYYY ou YYYY-MM-DD).
 * Autorise : chiffres, /, -
 */
export const sanitizeDate = (value: string): string =>
  value.replace(/[^0-9/\-]/g, '');

/** Longueurs maximales recommandées par type de champ */
export const MAX_LENGTHS = {
  name: 100,
  email: 254,
  phone: 20,
  zipCode: 20,
  address: 200,
  city: 100,
  password: 128,
  numericField: 5,   // taille/poids/heures
  message: 2000,
  text: 500,
} as const;
