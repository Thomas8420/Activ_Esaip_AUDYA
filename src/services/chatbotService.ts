import { apiFetch } from './api';

// ─── Toggle API ───────────────────────────────────────────────────────────────
// Mettre à true lorsque l'endpoint chatbot est prêt côté backend.
export const USE_CHATBOT_API = false;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChatbotMessage {
  id: number;
  isMe: boolean;
  text: string;
  timeText: string;
}

// Type de la réponse attendue de l'API (snake_case)
interface ChatbotApiResponse {
  reply: string;
  conversation_id?: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const MOCK_CHATBOT_MESSAGES: ChatbotMessage[] = [
  {
    id: 1,
    isMe: false,
    text: "Bonjour ! Je suis AUDYA, votre assistant santé intelligent. Je suis ici pour répondre à vos questions sur votre santé auditive, vos appareils et votre suivi médical.\n\nComment puis-je vous aider aujourd'hui ?",
    timeText: '09:00',
  },
  {
    id: 2,
    isMe: true,
    text: "Bonjour ! Comment bien entretenir mes appareils auditifs ?",
    timeText: '09:02',
  },
  {
    id: 3,
    isMe: false,
    text: "Voici les bonnes pratiques pour l'entretien de vos appareils :\n\n• Nettoyez-les chaque soir avec un chiffon doux et sec\n• Retirez les piles la nuit pour éviter l'humidité\n• Évitez toute exposition à l'eau ou à la chaleur\n• Utilisez une boîte de séchage si possible\n\nUn entretien professionnel est recommandé tous les 6 mois. N'hésitez pas si vous avez d'autres questions ! 😊",
    timeText: '09:02',
  },
];

// Réponses automatiques de secours en mode mock
const MOCK_AUTO_REPLIES: string[] = [
  "Je comprends votre question. Pour une réponse personnalisée, je vous recommande de contacter directement votre professionnel de santé depuis l'onglet « Mes professionnels ».",
  "Merci pour votre message ! Si votre question concerne un rendez-vous, vous pouvez consulter votre agenda depuis l'onglet dédié.",
  "Bonne question ! Pour toute urgence auditive, veuillez contacter votre audiologiste. Je reste disponible pour vous guider au mieux.",
  "Je prends note de votre demande. Pour un suivi personnalisé, votre équipe médicale est accessible depuis la messagerie de l'application.",
];

let mockReplyIndex = 0;

/** Retourne une réponse mock cyclique */
export function getMockReply(_userMessage: string): ChatbotMessage {
  const reply = MOCK_AUTO_REPLIES[mockReplyIndex % MOCK_AUTO_REPLIES.length];
  mockReplyIndex++;
  return {
    id: Date.now(),
    isMe: false,
    text: reply,
    timeText: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
  };
}

// ─── API ──────────────────────────────────────────────────────────────────────

/**
 * Envoie un message au chatbot et retourne sa réponse.
 * Endpoint : POST /api/chatbot/message
 */
export async function sendChatbotMessage(message: string): Promise<string> {
  const response = await apiFetch<ChatbotApiResponse>('/api/chatbot/message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  return response.reply;
}
