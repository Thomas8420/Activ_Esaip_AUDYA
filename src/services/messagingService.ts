import { apiFetch } from './api';

// ─── API response types (snake_case) ─────────────────────────────────────────

export interface ConversationApiResponse {
  id: number;
  subject: string;
  correspondent_id: string;
  correspondent_name: string;
  status: 'pending' | 'blocked' | 'finished';
  last_message: string;
  last_message_at: string;
  unread_count: number;
  users: string[];
}

export interface ContactApiResponse {
  id: string;
  name: string;
  avatar: string | null;
  status: 'online' | 'offline' | 'away';
}

export interface MessageFileApiResponse {
  id: number;
  name: string;
  url: string;
}

export interface MessageApiResponse {
  id: number;
  me: boolean;
  user_name: string;
  textcontent: string;
  timetext: string;
  created_at: string;
  files: MessageFileApiResponse[];
}

// ─── App-level types (camelCase) ─────────────────────────────────────────────

export interface Conversation {
  id: number;
  subject: string;
  correspondentId: string;
  correspondentName: string;
  status: 'pending' | 'blocked' | 'finished';
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface Contact {
  id: string;
  name: string;
  avatarUrl: string | null;
  status: 'online' | 'offline' | 'away';
}

export interface MessageFile {
  id: number;
  name: string;
  url: string;
}

export interface Message {
  id: number;
  isMe: boolean;
  userName: string;
  text: string;
  timeText: string;
  createdAt: string;
  files: MessageFile[];
}

/** Pièce jointe sélectionnée localement, avant upload */
export interface PendingAttachment {
  uri: string;
  name: string;
  type: string;
}

// ─── Mapping functions ────────────────────────────────────────────────────────

function mapConversation(raw: ConversationApiResponse): Conversation {
  return {
    id: raw.id,
    subject: raw.subject,
    correspondentId: String(raw.correspondent_id),
    correspondentName: raw.correspondent_name,
    status: raw.status,
    lastMessage: raw.last_message,
    lastMessageAt: raw.last_message_at,
    unreadCount: raw.unread_count,
  };
}

function mapContact(raw: ContactApiResponse): Contact {
  return {
    id: String(raw.id),
    name: raw.name,
    avatarUrl: raw.avatar,
    status: raw.status,
  };
}

export function mapMessage(raw: MessageApiResponse): Message {
  return {
    id: raw.id,
    isMe: raw.me,
    userName: raw.user_name,
    text: raw.textcontent,
    timeText: raw.timetext,
    createdAt: raw.created_at,
    files: raw.files.map(f => ({ id: f.id, name: f.name, url: f.url })),
  };
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const MOCK_CONTACTS: Contact[] = [
  { id: '1', name: 'Arnaud DEVEZE', avatarUrl: null, status: 'online' },
  { id: '2', name: 'Marie DUPONT',  avatarUrl: null, status: 'offline' },
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  { id: 1, subject: 'Draft 1', correspondentId: '1', correspondentName: 'Arnaud DEVEZE', status: 'pending',  lastMessage: 'Bonjour',    lastMessageAt: '2024-09-23T14:03:00', unreadCount: 2 },
  { id: 2, subject: 'Draft 2', correspondentId: '1', correspondentName: 'Arnaud DEVEZE', status: 'pending',  lastMessage: "C'est un test", lastMessageAt: '2024-05-24T09:11:00', unreadCount: 0 },
  { id: 3, subject: 'Draft 3', correspondentId: '1', correspondentName: 'Arnaud DEVEZE', status: 'pending',  lastMessage: 'Bonjour!',   lastMessageAt: '2024-09-23T09:07:00', unreadCount: 1 },
  { id: 4, subject: 'Draft 4', correspondentId: '1', correspondentName: 'Arnaud DEVEZE', status: 'finished', lastMessage: 'Merci',      lastMessageAt: '2024-08-10T10:00:00', unreadCount: 0 },
  { id: 5, subject: 'Draft 5', correspondentId: '2', correspondentName: 'Marie DUPONT',  status: 'pending',  lastMessage: 'RDV confirmé', lastMessageAt: '2024-07-15T11:30:00', unreadCount: 0 },
];

export const MOCK_MESSAGES: Message[] = [
  {
    id: 1,
    isMe: true,
    userName: 'Marseille PATIENT',
    text: 'Bonjour',
    timeText: '23/09/2024 à 14:03',
    createdAt: '2024-09-23T14:03:00',
    files: [],
  },
  {
    id: 2,
    isMe: false,
    userName: 'Pierre MURTO - Admin',
    text: "C'est un test : compte bloqué + piano swing, est-ce que l'erreur d'eses",
    timeText: '24/05/2024 à 9:11',
    createdAt: '2024-05-24T09:11:00',
    files: [],
  },
  {
    id: 3,
    isMe: false,
    userName: 'Arnaud DEVEZE',
    text: 'Bonjour!',
    timeText: '23/09/2024 à 9:07',
    createdAt: '2024-09-23T09:07:00',
    files: [{ id: 101, name: '2024-08-17 à 3:49.16.png', url: '/file/101' }],
  },
];

/** Passer à true dès que les endpoints /ajaxchat/* sont disponibles */
export const USE_MESSAGING_API = false;

// ─── API Functions ────────────────────────────────────────────────────────────

/**
 * GET /ajaxchat/getconversations
 * Retourne la liste des conversations + les contacts avec leur statut.
 */
export async function fetchConversations(): Promise<{
  conversations: Conversation[];
  contacts: Contact[];
}> {
  const raw = await apiFetch<{
    conversations: ConversationApiResponse[];
    contacts: ContactApiResponse[];
  }>('/ajaxchat/getconversations');
  return {
    conversations: raw.conversations.map(mapConversation),
    contacts: raw.contacts.map(mapContact),
  };
}

/**
 * GET /ajaxchat/getmessages/{conversation_id}?lastid={lastId}
 * Si lastId est fourni, retourne uniquement les messages plus récents.
 */
export async function fetchMessages(
  conversationId: number,
  lastId?: number,
): Promise<Message[]> {
  const url = lastId != null
    ? `/ajaxchat/getmessages/${conversationId}?lastid=${lastId}`
    : `/ajaxchat/getmessages/${conversationId}`;
  const raw = await apiFetch<{ messages: MessageApiResponse[] }>(url);
  return raw.messages.map(mapMessage);
}

/**
 * POST /ajaxchat/sendmessage
 * Envoie un message. Crée la conversation si conversation_id est absent.
 */
export async function sendMessage(params: {
  correspondentId: string;
  conversationId?: number | null;
  subject: string;
  message: string;
  fileIds?: number[];
}): Promise<{ messages: Message[]; conversationId: number }> {
  const body = new URLSearchParams({
    correspondent_id: params.correspondentId,
    subject: params.subject,
    message: params.message,
  });
  if (params.conversationId != null) {
    body.append('conversation_id', String(params.conversationId));
  }
  if (params.fileIds?.length) {
    body.append('files', JSON.stringify(params.fileIds.map(id => ({ file: id }))));
  }
  const raw = await apiFetch<{
    messages: MessageApiResponse[];
    conversation_id: number;
  }>('/ajaxchat/sendmessage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
  return {
    messages: raw.messages.map(mapMessage),
    conversationId: raw.conversation_id,
  };
}

/**
 * GET /ajaxchat/ping
 * Retourne les statuts en ligne de tous les contacts.
 */
export async function fetchContactStatuses(): Promise<Record<string, string>> {
  return apiFetch<Record<string, string>>('/ajaxchat/ping');
}

/**
 * POST /ajaxchat/setstatus
 * Définit le statut de l'utilisateur courant.
 */
export async function setUserStatus(
  status: 'online' | 'offline' | 'away' | 'dnd',
): Promise<void> {
  await apiFetch('/ajaxchat/setstatus', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ value: status }).toString(),
  });
}

/**
 * POST /ajaxchat/setconversationstatus/{conversation_id}
 * Modifie le statut d'une conversation.
 */
export async function setConversationStatus(
  conversationId: number,
  status: 'pending' | 'blocked' | 'finished',
): Promise<void> {
  await apiFetch(`/ajaxchat/setconversationstatus/${conversationId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ conversation_status: status }).toString(),
  });
}

/**
 * POST /upload/document
 * Upload un fichier et retourne son file_id pour l'inclure dans sendmessage.
 */
export async function uploadAttachment(
  uri: string,
  type: string,
  name: string,
): Promise<number> {
  const formData = new FormData();
  // React Native's fetch accepts { uri, type, name } as a file object in FormData
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (formData as any).append('file', { uri, type, name });
  const raw = await apiFetch<{ file_id: number }>('/upload/document', {
    method: 'POST',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body: formData as any,
  });
  return raw.file_id;
}
