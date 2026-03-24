// src/services/notificationService.ts
import { apiFetch } from './api';

// ─── Toggle API ────────────────────────────────────────────────────────────────
export const USE_NOTIFICATION_API = false;

// ─── Types applicatifs (camelCase) ────────────────────────────────────────────

export type NotificationType = 'message' | 'appointment' | 'questionnaire' | 'info';

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  /** Date ISO 8601 */
  createdAt: string;
  /** null = non lue */
  readAt: string | null;
  type: NotificationType;
}

// ─── Types API (snake_case) ───────────────────────────────────────────────────

interface NotificationApiResponse {
  id: string;
  title: string;
  body: string;
  created_at: string;
  read_at: string | null;
  type: NotificationType;
}

// ─── Mapping API → App ────────────────────────────────────────────────────────

function mapApiToNotification(raw: NotificationApiResponse): AppNotification {
  return {
    id: raw.id,
    title: raw.title,
    body: raw.body,
    createdAt: raw.created_at,
    readAt: raw.read_at,
    type: raw.type,
  };
}

// ─── Mock Data (supprimer quand l'API est prête) ──────────────────────────────

const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_1',
    title: 'Nouveau message',
    body: 'Dr. Martin vous a envoyé un message concernant votre suivi.',
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    readAt: null,
    type: 'message',
  },
  {
    id: 'notif_2',
    title: 'Rendez-vous confirmé',
    body: 'Votre RDV du 25 mars à 14h30 avec Mme Dupont est confirmé.',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    readAt: null,
    type: 'appointment',
  },
  {
    id: 'notif_3',
    title: 'Questionnaire à compléter',
    body: "N'oubliez pas de remplir votre questionnaire ERSA mensuel.",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    readAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
    type: 'questionnaire',
  },
  {
    id: 'notif_4',
    title: 'Bienvenue sur AUDYA',
    body: 'Votre espace patient est prêt. Explorez toutes les fonctionnalités disponibles.',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    readAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 60000).toISOString(),
    type: 'info',
  },
];

// ─── Persistence session (module-level) ──────────────────────────────────────
// TODO: remplacer par @react-native-async-storage/async-storage pour persistance inter-sessions
const _store: AppNotification[] = MOCK_NOTIFICATIONS.map(n => ({ ...n }));

// ─── Fonctions service ────────────────────────────────────────────────────────

/**
 * Retourne toutes les notifications, triées du plus récent au plus ancien.
 * En mode mock : lit le _store module-level.
 * En mode API  : GET /api/notifications
 */
export async function fetchNotifications(): Promise<AppNotification[]> {
  if (!USE_NOTIFICATION_API) {
    return [..._store].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  const raw = await apiFetch<NotificationApiResponse[]>('/api/notifications');
  return raw
    .map(mapApiToNotification)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Marque une notification comme lue.
 * En mode mock : met à jour le _store.
 * En mode API  : PATCH /api/notifications/:id/read
 */
export async function markAsRead(id: string): Promise<void> {
  if (!USE_NOTIFICATION_API) {
    const notif = _store.find(n => n.id === id);
    if (notif && notif.readAt === null) {
      notif.readAt = new Date().toISOString();
    }
    return;
  }
  await apiFetch<void>(`/api/notifications/${id}/read`, { method: 'PATCH' });
}

/**
 * Marque toutes les notifications comme lues.
 * En mode mock : met à jour le _store.
 * En mode API  : PATCH /api/notifications/read-all
 */
export async function markAllAsRead(): Promise<void> {
  if (!USE_NOTIFICATION_API) {
    const now = new Date().toISOString();
    _store.forEach(n => {
      if (n.readAt === null) { n.readAt = now; }
    });
    return;
  }
  await apiFetch<void>('/api/notifications/read-all', { method: 'PATCH' });
}
