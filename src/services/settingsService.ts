import { apiFetch } from './api';

// ─── API response types (snake_case — format backend) ─────────────────────────

export interface SettingsApiResponse {
  language: string;
  date_format: string;
  time_format: string;
  notifications_messages: boolean;
  notifications_alerts: boolean;
  notifications_tasks: boolean;
}

// ─── App-level types (camelCase) ─────────────────────────────────────────────

export interface UserSettings {
  language: string;
  dateFormat: string;
  timeFormat: string;
  notificationsMessages: boolean;
  notificationsAlerts: boolean;
  notificationsTasks: boolean;
}

// ─── Mapping snake_case → camelCase ──────────────────────────────────────────

function mapApiToSettings(raw: SettingsApiResponse): UserSettings {
  return {
    language: raw.language,
    dateFormat: raw.date_format,
    timeFormat: raw.time_format,
    notificationsMessages: raw.notifications_messages,
    notificationsAlerts: raw.notifications_alerts,
    notificationsTasks: raw.notifications_tasks,
  };
}

// ─── API Functions ────────────────────────────────────────────────────────────

/**
 * GET /api/patient/settings
 * TODO: endpoint non encore disponible côté backend
 */
export async function fetchSettings(): Promise<UserSettings> {
  const raw = await apiFetch<SettingsApiResponse>('/api/patient/settings');
  return mapApiToSettings(raw);
}

/**
 * PATCH /api/patient/settings
 * TODO: endpoint non encore disponible côté backend
 */
export async function saveSettings(settings: UserSettings): Promise<void> {
  await apiFetch('/api/patient/settings', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      language: settings.language,
      date_format: settings.dateFormat,
      time_format: settings.timeFormat,
      notifications_messages: settings.notificationsMessages,
      notifications_alerts: settings.notificationsAlerts,
      notifications_tasks: settings.notificationsTasks,
    }),
  });
}

/**
 * POST /api/patient/change-password
 * TODO: endpoint non encore disponible côté backend
 */
export async function changePassword(newPassword: string): Promise<void> {
  await apiFetch('/api/patient/change-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ new_password: newPassword }),
  });
}

/**
 * DELETE /api/patient/account
 * TODO: endpoint non encore disponible côté backend
 */
export async function deleteAccount(): Promise<void> {
  await apiFetch('/api/patient/account', { method: 'DELETE' });
}
