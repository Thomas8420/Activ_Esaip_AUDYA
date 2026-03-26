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
 * Règles : >= 8 caractères, 1 majuscule, 1 chiffre, 1 caractère spécial.
 */
export const validatePassword = (password: string): string | null => {
  if (!password) return ERROR_MESSAGES.PASSWORD_REQUIRED;
  if (password.length < 8) return ERROR_MESSAGES.PASSWORD_TOO_SHORT;
  if (!/[A-Z]/.test(password)) return 'Le mot de passe doit contenir au moins une majuscule';
  if (!/\d/.test(password)) return 'Le mot de passe doit contenir au moins un chiffre';
  if (!/[^A-Za-z0-9]/.test(password)) return 'Le mot de passe doit contenir au moins un caractère spécial';
  return null;
};

export const ERROR_MESSAGES = {
  EMAIL_REQUIRED: "L'email est requis",
  EMAIL_INVALID: 'Veuillez utiliser une adresse Gmail, Outlook, Orange, Yahoo ou similaire',
  PASSWORD_REQUIRED: 'Le mot de passe est requis', // NOSONAR
  PASSWORD_TOO_SHORT: 'Minimum 8 caractères', // NOSONAR
  PASSWORD_MISMATCH: 'Les mots de passe ne correspondent pas', // NOSONAR
};

// ─── Sanitisation des entrées utilisateur ────────────────────────────────────

/**
 * Retire les caractères HTML dangereux (<, >) de tout input texte.
 * Utilisé sur : noms, prénoms, adresses, villes, champs texte libres.
 */
export const stripXSS = (value: string): string =>
  value.replace(/[<>]/g, '');

/**
 * Sanitise un champ nom/prénom.
 * Retire <, > (XSS). Autorise lettres, chiffres, espaces, tirets, apostrophes, accents.
 */
export const sanitizeName = (value: string): string =>
  value.replace(/[<>]/g, '');

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
 * Sanitise un code postal (international).
 * Autorise : lettres, chiffres, espaces, tirets (UK: SW1A 1AA, FR: 75001, etc.)
 * Bloque : <, >, &, ", ', ;, /, \
 */
export const sanitizeZipCode = (value: string): string =>
  value.replace(/[^a-zA-Z0-9\s\-]/g, '');

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
