# 04 — Services & API

## Wrapper HTTP de base

**Fichier :** `src/services/api.ts`

Toutes les requêtes réseau **doivent** passer par `apiFetch<T>`. Ne jamais utiliser `fetch` directement.

```typescript
import { apiFetch } from '../services/api';

const data = await apiFetch<MyType[]>('/api/endpoint');
```

### Comportement

- **Base URL Dev :** `http://localhost:8000`
- **Base URL Prod :** `https://api.audya.com`
- **Timeout :** 10 secondes
- **Auth :** session HTTP + cookies (`credentials: 'include'`)
- **Headers par défaut :**
  - `Accept: application/json`
  - `Accept-Language: fr`
  - `X-Requested-With: XMLHttpRequest`
- **Erreurs :** classe `ApiError(status, message)` — catchée dans chaque Page

---

## Inventaire des services

### `authService.ts`
Authentification login + 2FA + reset password.
- `DEV_SKIP_2FA` — ne jamais mettre `true` en production.
- Code 2FA mock : `"123456"`

### `professionalsService.ts`
CRUD professionnels de santé du patient.
```
GET  /api/patient/professionals         (liste)
POST /patient/professionals/select-id/:id
POST /patient/delete-professional
```

### `settingsService.ts`
Préférences utilisateur (langue, formats, notifications, MDP, suppression).
- `USE_SETTINGS_API = false`

### `profileService.ts`
Profil patient + upload photo.
- `USE_PROFILE_API = false`
- Upload via `react-native-image-picker` — validation MIME + taille (≤ 3 Mo)

### `messagingService.ts`
Conversations sécurisées + envoi fichiers.
- `USE_MESSAGING_API = false`
- Upload documents via `react-native-document-picker`

### `agendaService.ts`
Événements agenda (CRUD) + mock store module-level.
- `USE_AGENDA_API = false`

### `healthService.ts`
Profil santé (IMC, antécédents, documents).
- `USE_HEALTH_API = false`

### `questionnaireService.ts`
ERSA + EQ-5D-5L : types binary/scale10/vas/choice5.
- `USE_QUESTIONNAIRE_API = false`
- Soumissions : persistence session module-level (TODO AsyncStorage)
- Types réponse : `binary` (Oui/Non), `scale10` (0–10), `vas` (0–100), `choice5` (radio texte)

### `notificationService.ts`
Notifications in-app (message, rendez-vous, questionnaire, info).
- `USE_NOTIFICATION_API = false`
- `fetchNotifications()`, `markAsRead(id)`, `markAllAsRead()`

### `newsService.ts`
Articles santé auditive (lecture seule).
- `USE_NEWS_API = false`

### `chatbotService.ts`
Messages assistant AUDYA.
- `USE_CHATBOT_API = false`

---

## État des endpoints backend

### Partiellement implémentés

| Endpoint | Méthode | Service |
|----------|---------|---------|
| `/patient/professionals/select-id/:id` | POST | `professionalsService.ts` |
| `/patient/delete-professional` | POST | `professionalsService.ts` |

### En attente d'implémentation

| Endpoint | Méthode | Service | Flag |
|----------|---------|---------|------|
| `/api/patient/professionals` | GET | `professionalsService.ts` | `USE_API` |
| `/api/patient/settings` | GET / PATCH | `settingsService.ts` | `USE_SETTINGS_API` |
| `/api/patient/change-password` | POST | `settingsService.ts` | — |
| `/api/patient/account` | DELETE | `settingsService.ts` | — |
| `/api/patient/profile` | GET / PATCH | `profileService.ts` | `USE_PROFILE_API` |
| `/api/patient/profile/photo` | POST | `profileService.ts` | — |
| `/ajaxchat/getconversations` | GET | `messagingService.ts` | `USE_MESSAGING_API` |
| `/ajaxchat/getmessages/:id` | GET | `messagingService.ts` | — |
| `/ajaxchat/sendmessage` | POST | `messagingService.ts` | — |
| `/upload/document` | POST | `messagingService.ts` | — |
| `/my-events` | GET | `agendaService.ts` | `USE_AGENDA_API` |
| `/events` | POST | `agendaService.ts` | — |
| `/events/delete` | POST | `agendaService.ts` | — |
| `/api/patient/health` | GET / PATCH | `healthService.ts` | `USE_HEALTH_API` |
| `/api/questionnaires` | GET | `questionnaireService.ts` | `USE_QUESTIONNAIRE_API` |
| `/api/questionnaire/:id` | GET | `questionnaireService.ts` | — |
| `/api/questionnaire/:id/submissions` | GET | `questionnaireService.ts` | — |
| `/api/questionnaire/submit` | POST | `questionnaireService.ts` | — |
| `/api/notifications` | GET | `notificationService.ts` | `USE_NOTIFICATION_API` |
| `/api/notifications/:id/read` | PATCH | `notificationService.ts` | — |
| `/api/notifications/read-all` | PATCH | `notificationService.ts` | — |
| `/api/news` | GET | `newsService.ts` | `USE_NEWS_API` |
| `/api/chatbot/message` | POST | `chatbotService.ts` | `USE_CHATBOT_API` |
| `/api/register` | POST | `RegisterStep1Page.tsx` | — |
| `/api/register/verify-email` | POST | `RegisterStep1BisPage.tsx` | — |
| `/api/register/patient-info` | POST | `RegisterStep2Page.tsx` | — |
| `/api/register/hearing-survey` | POST | `RegisterStep3Page.tsx` | — |
| `/api/register/medical-info` | POST | `RegisterStep4Page.tsx` | — |
| `/api/professionals/search` | POST | `RegisterStep5Page.tsx` | — |

---

## Procédure de branchement API

Pour chaque service, quand le backend est prêt :

1. **Vérifier** le shape JSON retourné par le backend
2. **Ajuster** la fonction `mapApiTo*` si des champs diffèrent du type `ApiResponse`
3. **Passer** `USE_*_API = true` dans le fichier service
4. **Tester** en mode API avec des données réelles
5. **Supprimer** les données mock après validation

---

## Gestion des erreurs réseau

```typescript
// Pattern standard dans chaque Page
try {
  const data = await fetchMyItems();
  setItems(data);
} catch (err) {
  // Ne pas exposer les détails à l'utilisateur final
  console.error('[MyPage] Failed to load:', err);
  setError('Impossible de charger les données.');
} finally {
  setIsLoading(false);
}
```

`apiFetch` lance une `ApiError(status, message)` en cas d'échec HTTP ou de timeout.
