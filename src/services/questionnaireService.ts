// src/services/questionnaireService.ts
import { apiFetch } from './api';

// ─── Toggle API ───────────────────────────────────────────────────────────────
export const USE_QUESTIONNAIRE_API = false;

// ─── Types applicatifs (camelCase) ────────────────────────────────────────────

export interface QuestionOption {
  value: number;
  label: string;
}

/**
 * binary  : Oui / Non
 * scale10 : curseur discret 0-10 (11 cases)
 * vas     : curseur discret 0-100 (11 cases : 0, 10, 20 … 100)
 * choice5 : 5 options texte (radio)
 */
export type QuestionType = 'binary' | 'scale10' | 'vas' | 'choice5';

export interface QuestionnaireQuestion {
  id: string;
  text: string;
  type: QuestionType;
  /** Pour choice5 et binary : libellés complets.
   *  Pour scale10/vas : automatiquement générés (voir SCALE10_OPTIONS). */
  options: QuestionOption[];
  /** Légende gauche pour scale10 / vas */
  minLabel?: string;
  /** Légende droite pour scale10 / vas */
  maxLabel?: string;
}

export interface Questionnaire {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  questions: QuestionnaireQuestion[];
}

export interface QuestionnaireSubmission {
  id: string;
  questionnaireId: string;
  /** Date ISO 8601 */
  submittedAt: string;
  /** questionId → valeur choisie */
  answers: Record<string, number>;
}

// ─── Types API (snake_case) — à ajuster selon le shape backend ────────────────

interface QuestionOptionApiResponse {
  value: number;
  label: string;
}

interface QuestionnaireQuestionApiResponse {
  id: string;
  text: string;
  type: QuestionType;
  options: QuestionOptionApiResponse[];
  min_label?: string;
  max_label?: string;
}

interface QuestionnaireApiResponse {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  questions: QuestionnaireQuestionApiResponse[];
}

interface SubmissionApiResponse {
  id: string;
  questionnaire_id: string;
  submitted_at: string;
  answers: Record<string, number>;
}

// ─── Mapping API → App ────────────────────────────────────────────────────────

function mapApiToQuestion(raw: QuestionnaireQuestionApiResponse): QuestionnaireQuestion {
  return {
    id: raw.id,
    text: raw.text,
    type: raw.type,
    options: raw.options,
    minLabel: raw.min_label,
    maxLabel: raw.max_label,
  };
}

function mapApiToQuestionnaire(raw: QuestionnaireApiResponse): Questionnaire {
  return {
    id: raw.id,
    title: raw.title,
    subtitle: raw.subtitle,
    description: raw.description,
    questions: raw.questions.map(mapApiToQuestion),
  };
}

function mapApiToSubmission(raw: SubmissionApiResponse): QuestionnaireSubmission {
  return {
    id: raw.id,
    questionnaireId: raw.questionnaire_id,
    submittedAt: raw.submitted_at,
    answers: raw.answers,
  };
}

// ─── Helpers options (utilisés uniquement par le mock) ───────────────────────

/** 0, 1, 2 … 10 */
const SCALE10_OPTIONS: QuestionOption[] = Array.from({ length: 11 }, (_, i) => ({
  value: i,
  label: String(i),
}));

/** 0, 10, 20 … 100 */
const VAS_OPTIONS: QuestionOption[] = Array.from({ length: 11 }, (_, i) => ({
  value: i * 10,
  label: String(i * 10),
}));

const BINARY_OPTIONS: QuestionOption[] = [
  { value: 1, label: 'Oui' },
  { value: 0, label: 'Non' },
];

// ─── Mock Data (supprimer quand l'API est prête) ──────────────────────────────

const MOCK_QUESTIONNAIRES: Questionnaire[] = [
  {
    id: 'ersa',
    title: 'ERSA',
    subtitle: "Évaluation du Retentissement de la Surdité chez l'Adulte",
    description:
      "Ce questionnaire évalue l'impact de votre perte auditive sur votre quotidien. Plus le chiffre est élevé, plus vous êtes satisfait(e).",
    questions: [
      {
        id: 'ersa_1',
        text: 'Appareillage ou implant en cours\nUtilisez-vous un appareillage ou un implant ?',
        type: 'binary',
        options: BINARY_OPTIONS,
      },
      {
        id: 'ersa_2',
        text: 'Évaluation de la qualité de vie\nComment estimez-vous votre qualité de vie ?',
        type: 'scale10',
        options: SCALE10_OPTIONS,
        minLabel: 'Pas satisfaisant(e)',
        maxLabel: 'Extrêmement satisfait(e)',
      },
      {
        id: 'ersa_3',
        text: 'Vous sentez-vous autonome dans votre quotidien ?',
        type: 'scale10',
        options: SCALE10_OPTIONS,
        minLabel: 'Pas du tout',
        maxLabel: 'Tout à fait',
      },
      {
        id: 'ersa_4',
        text: 'Comment qualifiez-vous votre état en ce moment ?',
        type: 'scale10',
        options: SCALE10_OPTIONS,
        minLabel: 'Pas satisfait(e)',
        maxLabel: 'Satisfait(e)',
      },
      {
        id: 'ersa_5',
        text: 'Avez-vous généralement confiance en vous ?',
        type: 'scale10',
        options: SCALE10_OPTIONS,
        minLabel: 'Pas du tout',
        maxLabel: 'Tout à fait',
      },
    ],
  },
  {
    id: 'eq5d5l',
    title: 'EQ-5D-5L',
    subtitle: 'Évaluation de la Qualité de Vie sur la Santé',
    description:
      "Ce questionnaire simplifié est destiné à évaluer votre qualité de vie sur 5 paramètres.",
    questions: [
      {
        id: 'eq5d_1',
        text: 'Mobilité',
        type: 'choice5',
        options: [
          { value: 1, label: "Je n'ai aucun problème pour me déplacer à pied" },
          { value: 2, label: "J'ai des problèmes légers pour me déplacer à pied" },
          { value: 3, label: "J'ai des problèmes modérés pour me déplacer à pied" },
          { value: 4, label: "J'ai des problèmes sévères pour me déplacer à pied" },
          { value: 5, label: "Je suis incapable de me déplacer à pied" },
        ],
      },
      {
        id: 'eq5d_2',
        text: 'Autonomie',
        type: 'choice5',
        options: [
          { value: 1, label: "Je n'ai aucun problème pour me laver ou m'habiller tout(e) seul(e)" },
          { value: 2, label: "J'ai des problèmes légers pour me laver ou m'habiller tout(e) seul(e)" },
          { value: 3, label: "J'ai des problèmes modérés pour me laver ou m'habiller tout(e) seul(e)" },
          { value: 4, label: "J'ai des problèmes sévères pour me laver ou m'habiller tout(e) seul(e)" },
          { value: 5, label: "Je suis incapable de me laver ou m'habiller tout(e) seul(e)" },
        ],
      },
      {
        id: 'eq5d_3',
        text: 'Activités courantes\n(travail, études, travaux domestiques, activités familiales ou loisirs)',
        type: 'choice5',
        options: [
          { value: 1, label: "Je n'ai aucun problème pour accomplir mes activités courantes" },
          { value: 2, label: "J'ai des problèmes légers pour accomplir mes activités courantes" },
          { value: 3, label: "J'ai des problèmes modérés pour accomplir mes activités courantes" },
          { value: 4, label: "J'ai des problèmes sévères pour accomplir mes activités courantes" },
          { value: 5, label: "Je suis incapable d'accomplir mes activités courantes" },
        ],
      },
      {
        id: 'eq5d_4',
        text: 'Douleurs / Inconfort',
        type: 'choice5',
        options: [
          { value: 1, label: "Je n'ai ni douleur ni inconfort" },
          { value: 2, label: "J'ai des douleurs ou un inconfort léger(s)" },
          { value: 3, label: "J'ai des douleurs ou un inconfort modéré(s)" },
          { value: 4, label: "J'ai des douleurs ou un inconfort sévère(s)" },
          { value: 5, label: "J'ai des douleurs ou un inconfort extrême(s)" },
        ],
      },
      {
        id: 'eq5d_5',
        text: 'Anxiété / Dépression',
        type: 'choice5',
        options: [
          { value: 1, label: "Je ne suis ni anxieux(se) ni déprimé(e)" },
          { value: 2, label: "Je suis légèrement anxieux(se) ou déprimé(e)" },
          { value: 3, label: "Je suis modérément anxieux(se) ou déprimé(e)" },
          { value: 4, label: "Je suis sévèrement anxieux(se) ou déprimé(e)" },
          { value: 5, label: "Je suis extrêmement anxieux(se) ou déprimé(e)" },
        ],
      },
      {
        id: 'eq5d_vas',
        text: "Votre santé AUJOURD'HUI\nNous aimerions savoir dans quelle mesure votre santé est bonne ou mauvaise aujourd'hui. Cette échelle est numérotée de 0 à 100.",
        type: 'vas',
        options: VAS_OPTIONS,
        minLabel: 'Pire santé imaginable',
        maxLabel: 'Meilleure santé imaginable',
      },
    ],
  },
];

// ─── Persistence session (module-level) ──────────────────────────────────────
// TODO: remplacer par @react-native-async-storage/async-storage pour persistance
// entre sessions une fois la dépendance installée.
const _store: QuestionnaireSubmission[] = [];

// ─── Fonctions service ────────────────────────────────────────────────────────

/**
 * Retourne la liste de tous les questionnaires disponibles.
 * En mode mock : retourne MOCK_QUESTIONNAIRES.
 * En mode API  : GET /api/questionnaires
 */
export async function fetchQuestionnaires(): Promise<Questionnaire[]> {
  if (!USE_QUESTIONNAIRE_API) {
    return MOCK_QUESTIONNAIRES;
  }
  const raw = await apiFetch<QuestionnaireApiResponse[]>('/api/questionnaires');
  return raw.map(mapApiToQuestionnaire);
}

/**
 * Retourne un questionnaire par son identifiant.
 * En mode mock : cherche dans MOCK_QUESTIONNAIRES.
 * En mode API  : GET /api/questionnaire/:id
 */
export async function fetchQuestionnaire(id: string): Promise<Questionnaire | undefined> {
  if (!USE_QUESTIONNAIRE_API) {
    return MOCK_QUESTIONNAIRES.find(q => q.id === id);
  }
  const raw = await apiFetch<QuestionnaireApiResponse>(`/api/questionnaire/${id}`);
  return mapApiToQuestionnaire(raw);
}

/**
 * Retourne les soumissions d'un questionnaire, triées du plus récent au plus ancien.
 * En mode mock : lit le _store module-level.
 * En mode API  : GET /api/questionnaire/:id/submissions
 */
export async function fetchSubmissions(questionnaireId: string): Promise<QuestionnaireSubmission[]> {
  if (!USE_QUESTIONNAIRE_API) {
    return _store
      .filter(s => s.questionnaireId === questionnaireId)
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }
  const raw = await apiFetch<SubmissionApiResponse[]>(
    `/api/questionnaire/${questionnaireId}/submissions`
  );
  return raw
    .map(mapApiToSubmission)
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
}

/**
 * Enregistre une nouvelle soumission.
 * En mode mock : persiste dans le _store module-level.
 * En mode API  : POST /api/questionnaire/submit
 */
export async function submitQuestionnaire(
  questionnaireId: string,
  answers: Record<string, number>
): Promise<QuestionnaireSubmission> {
  if (!USE_QUESTIONNAIRE_API) {
    const submission: QuestionnaireSubmission = {
      id: `sub_${Date.now()}`,
      questionnaireId,
      submittedAt: new Date().toISOString(),
      answers,
    };
    _store.unshift(submission);
    return submission;
  }
  const raw = await apiFetch<SubmissionApiResponse>('/api/questionnaire/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ questionnaire_id: questionnaireId, answers }),
  });
  return mapApiToSubmission(raw);
}

/**
 * Formate une soumission en texte lisible pour l'export (Share natif).
 */
export function formatSubmissionForExport(
  questionnaire: Questionnaire,
  submission: QuestionnaireSubmission
): string {
  const date = new Date(submission.submittedAt).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const time = new Date(submission.submittedAt).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const separator = '─'.repeat(40);

  const questionLines = questionnaire.questions.map((q, idx) => {
    const value = submission.answers[q.id];
    let answerLabel = 'Sans réponse';

    if (value !== undefined) {
      if (q.type === 'binary') {
        answerLabel = value === 1 ? 'Oui' : 'Non';
      } else if (q.type === 'scale10') {
        answerLabel = `${value} / 10`;
      } else if (q.type === 'vas') {
        answerLabel = `${value} / 100`;
      } else {
        answerLabel = q.options.find(o => o.value === value)?.label ?? String(value);
      }
    }

    // Retire le sous-titre (ex: "Mobilité\n…") pour l'export
    const cleanText = q.text.replace(/^.+\n/, '').trim();
    return `Q${idx + 1}. ${cleanText}\n   → ${answerLabel}`;
  });

  return [
    questionnaire.title,
    questionnaire.subtitle,
    separator,
    `Complété le ${date} à ${time}`,
    separator,
    '',
    ...questionLines.flatMap(l => [l, '']),
    separator,
    'AUDYA — Suivi auditif patient',
  ].join('\n');
}
