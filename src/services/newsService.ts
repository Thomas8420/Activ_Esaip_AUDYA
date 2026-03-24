// src/services/newsService.ts

// ─── Toggle API ───────────────────────────────────────────────────────────────
export const USE_NEWS_API = false;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NewsArticle {
  id: number;
  category: string;
  title: string;
  excerpt: string;
  content: string;
  /** YYYY-MM-DD */
  date: string;
  readMinutes: number;
}

// ─── Mock articles ────────────────────────────────────────────────────────────

export const MOCK_NEWS: NewsArticle[] = [
  {
    id: 1,
    category: 'Technologie',
    title: 'Les aides auditives connectées : une révolution pour les malentendants',
    excerpt:
      "Les nouvelles générations d'aides auditives intègrent Bluetooth, intelligence artificielle et réduction de bruit adaptative pour une expérience sonore sur mesure.",
    content: `Les nouvelles générations d'aides auditives ont connu une évolution spectaculaire ces dernières années. Dotées de connectivité Bluetooth 5.2, elles s'interfacent désormais directement avec les smartphones, téléviseurs et systèmes audio pour offrir une expérience sonore personnalisée.

L'intelligence artificielle embarquée analyse en temps réel l'environnement sonore et adapte automatiquement les paramètres de l'appareil. Dans un restaurant bruyant, l'aide auditive filtre les bruits de fond ; dans une salle de réunion, elle privilégie la voix des interlocuteurs proches.

Les modèles de dernière génération intègrent également des capteurs de santé capables de mesurer la fréquence cardiaque et de détecter les chutes. Une avancée majeure pour les patients âgés qui bénéficient ainsi d'un suivi médical continu sans équipement supplémentaire.`,
    date: '2026-03-22',
    readMinutes: 4,
  },
  {
    id: 2,
    category: 'Santé auditive',
    title: 'Dépistage auditif : pourquoi consulter dès les premiers signes ?',
    excerpt:
      "La perte auditive est souvent diagnostiquée trop tardivement. Un dépistage précoce permet de mieux accompagner le patient et d'optimiser les résultats de l'appareillage.",
    content: `La perte auditive est souvent qualifiée de "handicap invisible" : ses manifestations sont progressives et les patients tardent fréquemment à consulter. En moyenne, on estime que 7 à 10 ans s'écoulent entre les premiers signes et la prise en charge effective.

Pourtant, un dépistage précoce change radicalement le pronostic. Détectée à temps, une hypoacousie légère à modérée peut être compensée efficacement par un appareillage adapté, limitant les conséquences sur la qualité de vie, les relations sociales et les performances professionnelles.

Les spécialistes recommandent un bilan auditif dès 50 ans, ou dès l'apparition de difficultés à suivre des conversations, d'acouphènes persistants ou d'une sensation d'oreilles bouchées. Votre audioprothésiste peut vous orienter vers les professionnels compétents.`,
    date: '2026-03-18',
    readMinutes: 3,
  },
  {
    id: 3,
    category: 'Prévention',
    title: 'Protéger son audition au quotidien : les 5 gestes essentiels',
    excerpt:
      "Casques audio, concerts, environnements bruyants : notre audition est exposée en permanence. Voici les bons réflexes à adopter dès maintenant pour préserver votre capital auditif.",
    content: `Chaque jour, notre audition est mise à l'épreuve : musique forte dans les transports, environnements de travail bruyants, concerts... L'exposition répétée à des niveaux sonores élevés entraîne une dégradation progressive et irréversible des cellules ciliées de l'oreille interne.

Cinq gestes simples peuvent préserver votre capital auditif. Respectez la règle des 60/60 : casque audio à 60 % du volume maximum pendant 60 minutes au plus. Faites des pauses sonores régulières pour permettre à vos oreilles de récupérer. Portez des bouchons d'oreilles ou un casque anti-bruit dans les environnements professionnels bruyants.

Éloignez-vous des sources sonores intenses lors de concerts ou d'événements festifs, et consultez un spécialiste si vous ressentez des sifflements ou une fatigue auditive après une exposition. Ces précautions simples permettent de conserver une audition de qualité bien plus longtemps.`,
    date: '2026-03-15',
    readMinutes: 2,
  },
  {
    id: 4,
    category: 'Actualités AUDYA',
    title: 'AUDYA lance le suivi des questionnaires ERSA et EQ-5D-5L',
    excerpt:
      "Nouvelle fonctionnalité disponible dans votre espace patient : complétez vos questionnaires de qualité de vie directement depuis l'application et consultez vos réponses précédentes.",
    content: `AUDYA enrichit son application patient avec une nouvelle fonctionnalité dédiée au suivi qualitatif : les questionnaires ERSA et EQ-5D-5L sont désormais disponibles directement depuis votre espace personnel.

Le questionnaire ERSA (Évaluation du Retentissement de la Surdité chez l'Adulte) permet d'évaluer l'impact de votre perte auditive sur votre quotidien à travers 5 questions simples. L'EQ-5D-5L, outil de référence internationale, mesure votre qualité de vie générale sur 5 dimensions ainsi qu'une échelle visuelle de 0 à 100.

Ces données, partagées avec votre équipe de soins, permettent un suivi longitudinal précis et personnalisé. Vos réponses sont enregistrées et consultables à tout moment depuis la section "Mes questionnaires". La fonctionnalité de téléchargement vous permet d'exporter vos résultats pour les transmettre à votre médecin.`,
    date: '2026-03-10',
    readMinutes: 2,
  },
  {
    id: 5,
    category: 'Santé auditive',
    title: "Acouphènes : comprendre et mieux vivre avec ces bruits fantômes",
    excerpt:
      "Les acouphènes touchent près de 15 % de la population adulte. Des thérapies sonores et cognitivo-comportementales permettent aujourd'hui de réduire significativement leur impact.",
    content: `Les acouphènes — ces bourdonnements, sifflements ou tintements perçus en l'absence de source sonore externe — touchent environ 15 % de la population adulte. Pour 2 à 3 % d'entre eux, ils représentent un handicap significatif affectant le sommeil, la concentration et la santé mentale.

La recherche progresse rapidement dans ce domaine. Les thérapies sonores (bruit blanc, sons de nature, musique adaptée) permettent à de nombreux patients de "déshabituer" le cerveau aux acouphènes. La thérapie cognitivo-comportementale (TCC) aide quant à elle à modifier la perception émotionnelle du son parasite.

Des dispositifs innovants combinent aujourd'hui stimulation acoustique et électrique pour réduire l'intensité des acouphènes. Parlez-en à votre audioprothésiste : des solutions existent et la prise en charge précoce améliore significativement les résultats à long terme.`,
    date: '2026-03-05',
    readMinutes: 5,
  },
  {
    id: 6,
    category: 'Administratif',
    title: "Remboursement des aides auditives : le point sur la réglementation",
    excerpt:
      'Depuis la réforme du 100 % Santé, les aides auditives sont mieux remboursées. Découvrez les démarches pour optimiser votre prise en charge et réduire votre reste à charge.',
    content: `Depuis l'entrée en vigueur de la réforme "100 % Santé" en 2021, le remboursement des aides auditives a été profondément réformé. Un panier "reste à charge zéro" garantit désormais un accès à des dispositifs de qualité sans dépense pour l'assuré, sous réserve de respecter les conditions de prescription.

Pour bénéficier d'une prise en charge optimale, vous devez obtenir une prescription de votre médecin ORL ou généraliste, choisir un audioprothésiste agréé, puis effectuer votre bilan d'adaptation. La Sécurité sociale rembourse une part fixe, complétée par votre mutuelle si vous bénéficiez d'un contrat responsable.

Il est recommandé de comparer les offres de plusieurs audioprothésistes et de vous assurer que le modèle proposé correspond à votre niveau de perte auditive. Votre application AUDYA recense vos professionnels de santé pour faciliter ces démarches administratives.`,
    date: '2026-03-01',
    readMinutes: 3,
  },
];

// ─── Fonctions service ────────────────────────────────────────────────────────

/** Retourne les articles triés du plus récent au plus ancien. */
export function getNews(): NewsArticle[] {
  return [...MOCK_NEWS].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}
