# Cahier des charges - API mobile AUDYA

Document technique destiné à l'équipe backend, listant l'intégralité des endpoints requis par l'application mobile React Native AUDYA pour fonctionner sur données réelles.

---

## 1. Contexte

L'application mobile React Native AUDYA est actuellement complète côté UI (16 écrans fonctionnels) et fonctionne en mode mock. L'authentification a déjà été branchée avec succès sur les routes `/api/auth/*` livrées sur preprod (cf. message du 2 juin 2026, commit `feature/api-auth-mobile`).

Pour que l'application puisse afficher des données réelles, **chaque écran a besoin d'un ou plusieurs endpoints exposés sous `/api/*` avec authentification Sanctum** (Bearer token). Les routes web existantes (`/patient/*`, `/ajaxchat/*`, etc. qui retournent du HTML ou redirigent vers la page de login) ne sont **pas utilisables** par un client mobile.

Ce document liste les **42 endpoints attendus** (dont 35 déjà consommés par le mobile via les routes web actuelles, et 7 planifiés pour la phase 2), leurs contrats (méthode, URL, request body, response shape) et les contraintes de sécurité associées. Les endpoints marqués `(planifié)` ne sont pas encore appelés par le mobile et correspondent à des écrans dont le branchement est prévu en phase 2.

---

## 2. Conventions générales

### Authentification

Toutes les routes listées ici sont **authentifiées** via Laravel Sanctum sauf mention contraire :

```
Authorization: Bearer <token-sanctum>
Accept: application/json
Content-Type: application/json (pour POST/PATCH/PUT)
```

Le token est celui retourné par `POST /api/auth/verify-2fa`. Sa durée de vie annoncée est de 8h via `expires_at`. Toute requête avec un token expiré, révoqué, ou inexistant doit retourner **`401 Unauthorized`**. L'app mobile a un handler global qui clear la session locale sur 401.

### Format des dates

Les dates retournées par l'API doivent utiliser le format **ISO 8601** :
```
2026-06-02T12:47:13.211057Z
```

Le format `YYYY-MM-DD HH:mm:ss` est accepté en alternative. Le format français `DD/MM/YYYY` doit être évité côté API - il sera converti côté mobile.

### Format de la casse

Les champs JSON sont attendus en **snake_case** (cohérent avec Laravel et avec `/api/auth/verify-2fa`). L'app mobile applique un mapping snake_case → camelCase via des "mappers" dédiés. Si une réponse mélange `firstname` (single word) et `birth_date` (snake_case), c'est gérable mais à éviter pour la lisibilité.

### Sécurité - règle d'or

**Chaque route DOIT utiliser une Laravel Resource (ou équivalent) qui whitelist explicitement les champs publics.** Le mobile a déjà constaté que `/api/user` renvoie aujourd'hui en clair :

```json
{
  "two_factor_auth_code": "930677",
  "social_number": "165133135121312",
  "magic_link": null,
  "stripe_customer_id": null,
  "...": "..."
}
```

Champs concernés par ordre de criticité : `two_factor_auth_code` (code 2FA actif du compte), `social_number` (numéro de sécurité sociale, donnée RGPD), `magic_link` (token de connexion sans mot de passe), `stripe_customer_id` (identifiant facturation).

C'est une **fuite critique** : un token Sanctum compromis donne accès au code 2FA actif → un attaquant peut compromettre n'importe quel compte sans le mot de passe. À corriger en priorité **avant la livraison de chaque nouvel endpoint**.

### Gestion des erreurs

Format de réponse en cas d'erreur :

```json
{ "message": "Description lisible pour l'utilisateur final" }
```

Codes HTTP utilisés par le mobile :
| Code | Signification | Action mobile |
|---|---|---|
| `200` / `204` | Succès | Affichage normal |
| `400` / `422` | Validation client | Affichage du `message` à l'utilisateur |
| `401` | Token invalide / expiré | **Logout automatique** + retour login |
| `403` | Pas l'autorisation | Affichage du `message` |
| `404` | Ressource introuvable | Affichage générique |
| `429` | Rate limit | Affichage du `message` |
| `5xx` | Erreur serveur | Affichage générique "Service indisponible" |

### Rate limiting

Recommandé sur tous les endpoints sensibles. Rate limits annoncés via les headers :
```
x-ratelimit-limit: 60
x-ratelimit-remaining: 59
```

**Cas critique** : `verify-2fa` et `resend-code` doivent être strictement rate-limités (sinon brute-force du code à 6 chiffres = ~1M tentatives en quelques secondes).

---

## 3. Pré-requis déjà livrés (référence)

**`POST /api/auth/login`** - `{ email, password }` → `{ pending_token, expires_in }`
**`POST /api/auth/verify-2fa`** - `{ pending_token, code }` → `{ token, expires_at, user }`
**`POST /api/auth/resend-code`** - `{ pending_token }` → `void`
**`POST /api/auth/logout`** - Bearer → `204`

Ces routes sont la **référence d'architecture** pour tout le reste : JSON in / JSON out, Sanctum Bearer, snake_case, pas de cookie, pas de CSRF.

---

## 4. Inventaire des endpoints à livrer

### Lot 1 - Profil utilisateur

#### `GET /api/patient/profile`
Récupère les informations personnelles du patient connecté.

**Response 200 :**
```json
{
  "id": 16,
  "gender": "homme" | "femme",
  "birth_date": "1988-04-11T22:00:00.000000Z",
  "first_name": "Marie",
  "last_name": "Dupont",
  "email": "marie.dupont@example.com",
  "phone": "0612345678",
  "phone_fax": "0123456789",
  "address": "12 rue des Lilas",
  "address_complement": null,
  "zip_code": "75012",
  "city": "Paris",
  "country": "France",
  "profile_picture_url": "https://cdn.audya.fr/profiles/16.jpg"
}
```

**Types attendus côté mobile :**
- `id` : entier (number). Le mobile le caste en string côté UI mais accepte un entier en transit.
- `gender` : énumération stricte `"homme" | "femme"` (lowercase).
- `birth_date` : ISO 8601 ou `YYYY-MM-DD` accepté.
- `address_complement` : `string | null` (peut être absent - le mobile actuel le typage en `string` non-null ; à robustifier si null renvoyé).
- `profile_picture_url` : `string | null` (null si aucune photo uploadée).
- Tous les autres champs : `string` non-null. Le backend doit envoyer `""` plutôt que `null` pour les chaînes vides.

**Ne PAS exposer** : `social_number`, `two_factor_auth_*`, `magic_link*`, `stripe_*`, `password*`, `email_verified_at`, `registration_step`, `parent_id`, `is_deleted`, `deleted_at`, `pro_key`, `parcours_id`, `subscription_plan_id`.

---

#### `PATCH /api/patient/profile`
Met à jour le profil patient.

**Request body :**
```json
{
  "gender": "homme" | "femme",
  "birth_date": "1988-04-11",
  "first_name": "string",
  "last_name": "string",
  "phone": "string",
  "phone_fax": "string",
  "address": "string",
  "address_complement": "string",
  "zip_code": "string",
  "city": "string",
  "country": "string",
  "email": "string"
}
```

Tous les champs sont optionnels (PATCH partiel). Validation côté serveur :
- `email` : format RFC + unique
- `birth_date` : date valide, antérieure à aujourd'hui
- `zip_code` : 5 chiffres (FR)

**Response 200 :** mêmes champs que GET (profil mis à jour).

---

#### `POST /api/patient/profile/photo`
Upload une nouvelle photo de profil. Multipart.

**Request (multipart/form-data) :**
```
photo: <fichier image>
```

Contraintes :
- Taille max : **3 Mo** (vérifié aussi côté mobile)
- MIME autorisés : `image/jpeg`, `image/png`, `image/heic`, `image/heif`
- Validation MIME côté serveur **obligatoire** (ne pas faire confiance au header envoyé)

**Response 200 :**
```json
{ "profile_picture_url": "https://cdn.audya.fr/profiles/16.jpg?v=2" }
```

---

### Lot 2 - Paramètres

#### `GET /api/patient/settings`
Récupère les paramètres utilisateur.

**Response 200 :**
```json
{
  "language": "fr" | "en",
  "date_format": "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY-MM-DD",
  "time_format": "24" | "12",
  "notifications_messages": true,
  "notifications_alerts": true,
  "notifications_tasks": false
}
```

---

#### `PATCH /api/patient/settings`
Met à jour les paramètres utilisateur. Tous les champs optionnels.

**Request body :** mêmes champs que GET (snake_case).
**Response 200 :** paramètres mis à jour.

---

#### `POST /api/patient/change-password`
Change le mot de passe du compte.

**Request body attendu (cible) :**
```json
{
  "current_password": "string",
  "new_password": "string"
}
```

État actuel du mobile : le client n'envoie que `new_password` (à corriger côté mobile pour ajouter `current_password`). Le backend peut commencer par valider uniquement `new_password` puis activer la vérification de `current_password` quand le mobile sera aligné. Recommandation sécurité : exiger `current_password` même si l'utilisateur est authentifié (défense en profondeur en cas de token volé).

**Response 200 :** `{ "message": "Mot de passe mis à jour." }`
**Response 422 :** `{ "message": "Mot de passe actuel incorrect." }`

Doit **invalider tous les autres tokens Sanctum** de cet utilisateur (sauf le courant) pour forcer la déconnexion sur les autres appareils.

---

#### `DELETE /api/patient/account`
Supprime définitivement le compte utilisateur (RGPD - droit à l'effacement).

**Request body attendu (cible) :**
```json
{ "password": "string" }
```

État actuel du mobile : le client envoie un DELETE sans body (à corriger pour exiger la confirmation par mot de passe). Le backend doit prévoir ce body même si le mobile ne l'envoie pas encore. Confirmation par mot de passe **obligatoire** vu la criticité.

**Response 204** : compte supprimé. Le token Sanctum est immédiatement invalidé.

---

### Lot 3 - Santé

#### `GET /api/patient/health`
Récupère le profil santé complet du patient.

**Response 200 :**
```json
{
  "full_name": "Marie Dupont",
  "age": 38,
  "gender": "Femme",
  "address_line": "12 rue des Lilas",
  "city_zip": "75012 Paris",
  "bmi": 22.5,
  "sex": "Femme",
  "smoker": "Non",
  "height_cm": 168,
  "weight_kg": 63,
  "family_history": "Diabète type 2 (père), hypertension (mère)",
  "medical_history": ["Asthme léger", "Otite récurrente enfance"],
  "surgical_history": ["Appendicectomie 2010"],
  "medications": ["Ventoline 100µg si besoin"],
  "allergies": ["Pénicilline", "Pollen"],
  "physical_activity_hours": "3h / semaine",
  "documents": ["compte_rendu_audio_2025.pdf"]
}
```

**Types attendus côté mobile :**
- `gender` et `sex` : énumération `"Homme" | "Femme"` (avec majuscule initiale, différent du Lot 1 qui utilise lowercase).
- `smoker` : énumération `"Oui" | "Non"`.
- `age`, `bmi`, `height_cm`, `weight_kg` : nombres.
- `medical_history`, `surgical_history`, `medications`, `allergies`, `documents` : tableaux de strings.
- `physical_activity_hours` : string libre (pas un nombre - peut être "3h / semaine", "Quotidien", etc.).

Toutes ces données sont **HDS** (Hébergement de Données de Santé). L'endpoint **doit** être audité dans la conformité HDS du backend.

> Pas d'endpoint PATCH pour l'instant : l'écran "Ma Santé" du mobile est en lecture seule. À ajouter en phase 2 si l'édition est ouverte côté UI.

---

### Lot 4 - Professionnels

#### `GET /api/patient/professionals`
Récupère la liste des professionnels de santé associés au patient.

**Response 200 :**
```json
[
  {
    "id": 42,
    "first_name": "Jean",
    "last_name": "Martin",
    "email": "j.martin@hopital-paris.fr",
    "phone": "0145678900",
    "specialization": "ORL",
    "hospital": "Hôpital Saint-Antoine",
    "invitation_status": "pending"
  }
]
```

**Types attendus côté mobile :**
- `id` : entier (number).
- `invitation_status` : énumération `"pending" | "accepted" | "rejected"`, champ optionnel (peut être absent).
- Tous les autres champs : `string` non-null.

**Ne PAS exposer** : `password`, `rpps_number` (réservé aux admins), `social_number`, `salary`, `notes_internes`, etc.

---

#### `POST /api/patient/professionals/:professional_id`
Ajoute un professionnel à l'équipe soignante du patient.

**Path param :** `professional_id` (entier, URL-encodé).
**Request body :** vide.
**Response 200 :** `{ "message": "Professionnel ajouté." }`
**Response 404 :** si le professionnel n'existe pas.
**Response 409 :** si déjà associé.

État actuel mobile : appelle `POST /patient/professionals/select-id/:id`. Le mobile s'alignera sur l'URL REST `/api/patient/professionals/:id` à la livraison de cette route. Garder un alias temporaire si besoin de rétro-compatibilité.

---

#### `DELETE /api/patient/professionals/:professional_id`
Supprime l'association à un professionnel.

**Path param :** `professional_id`.
**Response 204 :** supprimé.

État actuel mobile : appelle `POST /patient/delete-professional` avec body urlencoded `pro_id=...`. À aligner sur le DELETE RESTful à la livraison.

---

#### `POST /api/professionals/search` (planifié)
Recherche un professionnel par critères (utilisé pendant l'inscription et l'ajout).

État actuel mobile : aucune fonction n'appelle cet endpoint pour l'instant. Des TODOs sont en place dans `AddProfessionalPage.tsx` et `RegisterStep5Page.tsx`. Sera consommé en phase 2 dès livraison backend.

**Request body :**
```json
{
  "last_name": "string (optionnel)",
  "first_name": "string (optionnel)",
  "specialization": "string (optionnel)",
  "zip_code": "string (optionnel)",
  "city": "string (optionnel)"
}
```

Au moins un critère obligatoire.

**Response 200 :**
```json
[
  {
    "id": 42,
    "first_name": "Jean",
    "last_name": "Martin",
    "specialization": "ORL",
    "hospital": "Hôpital Saint-Antoine",
    "city": "Paris",
    "zip_code": "75012"
  }
]
```

> Limiter à 50 résultats. Rate limit recommandé : 30/min/utilisateur.

---

#### `POST /api/patient/invite-professional` (planifié)
Invite un nouveau professionnel par email (cas où il n'est pas encore dans la base). État actuel mobile : aucune fonction n'appelle cet endpoint. Sera consommé en phase 2.

**Request body :**
```json
{
  "first_name": "string",
  "last_name": "string",
  "email": "string",
  "specialization": "string",
  "consent_data_share": true
}
```

Le champ `consent_data_share` doit être `true` (validation explicite RGPD Art. 9, déjà acté côté mobile).

**Response 200 :** `{ "message": "Invitation envoyée." }`

---

### Lot 5 - Agenda

#### `GET /api/my-events`
Récupère les événements de l'agenda du patient.

État actuel mobile : appelle `/my-events` (sans préfixe `/api`). À aligner sur `/api/my-events` à la livraison. Aucun query param n'est envoyé pour l'instant.

**Query params optionnels (futur) :**
- `from`: ISO date (par défaut : aujourd'hui)
- `to`: ISO date (par défaut : +1 mois)

**Response 200 :**
```json
{
  "events": [
    {
      "id": 101,
      "title": "Consultation Dr Martin",
      "type": "appointment" | "task" | "reminder",
      "start": "2026-06-15 10:30",
      "end": "2026-06-15 11:30",
      "location": "Hôpital Saint-Antoine, cabinet 4",
      "description": "Bilan post-appareillage",
      "patient_name": "Marie Dupont",
      "backgroundColor": "#3ABFBF"
    }
  ]
}
```

**Types et conventions attendus côté mobile :**
- `id` : entier.
- `start`, `end` : strings `YYYY-MM-DD HH:mm` (le mobile tronque à 16 caractères en lecture, supporte aussi `YYYY-MM-DD HH:mm:ss` et ISO 8601).
- `backgroundColor` : **exception à la convention snake_case**, le backend doit renvoyer en camelCase pour ce champ unique (compatibilité avec l'ancienne API web déjà consommée par le mobile). À harmoniser en snake_case dans une phase ultérieure.
- `patient_name` : utilisé côté mobile comme nom du correspondant (souvent un professionnel). À renommer en `correspondent_name` ou `professional_name` côté API quand possible.
- `location`, `description`, `patient_name`, `backgroundColor` : optionnels.

---

#### `POST /api/events`
Crée un nouvel événement.

État actuel mobile : appelle `POST /events` (sans `/api`) avec body :
```json
{
  "name": "string",
  "type": "appointment" | "task" | "reminder",
  "start": "2026-06-15 10:30:00",
  "end": "2026-06-15 11:30:00",
  "location": "string (optionnel)",
  "description": "string (optionnel)"
}
```

**Conventions :**
- `name` : titre de l'événement. Le mobile envoie `name`, pas `title`. Le backend doit accepter `name` ; cible à terme : harmoniser sur `title` (cohérent avec la response GET).
- `start`, `end` : format `YYYY-MM-DD HH:mm:ss` (le mobile ajoute les secondes en suffixe lors du POST).

**Response 201 :**
```json
{ "event_id": 101 }
```

---

#### `DELETE /api/events/:event_id`
Supprime un événement.

**Path param :** `event_id`.
**Response 204 :** supprimé.
**Response 403 :** si l'événement n'appartient pas à l'utilisateur connecté.

État actuel mobile : appelle `POST /events/delete` avec body JSON `{ "event_id": <id> }`. À aligner sur DELETE RESTful à la livraison.

> Pas d'endpoint PATCH pour l'édition : le mobile fait actuellement delete+create pour modifier un événement. À ajouter en phase 2 si l'édition optimisée est nécessaire.

---

### Lot 6 - Messagerie

> **État du mobile pour ce lot :** toutes les URLs cibles `/api/messaging/*` sont aujourd'hui consommées via les anciennes routes `/ajaxchat/*` (héritées de l'API web). Le mobile s'alignera sur les nouvelles URLs REST à la livraison. Les Content-Type actuels mêlent `application/x-www-form-urlencoded` et JSON ; le cible est JSON partout sauf upload multipart. Le tableau de correspondance figure sous chaque endpoint.

#### `GET /api/messaging/conversations`
Récupère les conversations et la liste des contacts disponibles.

État actuel mobile : `GET /ajaxchat/getconversations`.

**Response 200 :**
```json
{
  "conversations": [
    {
      "id": 7,
      "subject": "Suivi appareillage",
      "correspondent_id": "42",
      "correspondent_name": "Dr Jean Martin",
      "status": "pending" | "blocked" | "finished",
      "last_message": "Bonjour, comment allez-vous ?",
      "last_message_at": "2026-06-01T14:30:00Z",
      "unread_count": 2,
      "users": ["16", "42"]
    }
  ],
  "//": "users[] présent en API mais non consommé côté mobile (peut être retiré).",
  "contacts": [
    {
      "id": "42",
      "name": "Dr Jean Martin",
      "avatar": "https://cdn.audya.fr/avatars/42.jpg",
      "status": "online" | "offline" | "away"
    }
  ]
}
```

---

#### `GET /api/messaging/conversations/:conversation_id/messages`
Récupère les messages d'une conversation.

État actuel mobile : `GET /ajaxchat/getmessages/:conversation_id` avec query param `lastid` (à renommer `since_id` à la livraison).

**Path param :** `conversation_id`.
**Query param optionnel :** `since_id` (n'envoie que les messages plus récents que cet ID - pour polling efficace).

**Response 200 :**
```json
{
  "messages": [
    {
      "id": 1024,
      "me": true,
      "user_name": "Marie Dupont",
      "textcontent": "Bonjour docteur",
      "timetext": "14:30",
      "created_at": "2026-06-01T14:30:00Z",
      "files": [
        { "id": 88, "name": "audiogramme.pdf", "url": "https://cdn.audya.fr/docs/88.pdf" }
      ]
    }
  ]
}
```

**Conventions :**
- `me: boolean` est calculé côté backend (`user_id === auth()->id()`).
- `timetext` : string libre (typiquement `HH:mm`) directement affichée par le mobile. Le mobile pourrait à terme dériver cette valeur de `created_at`, mais aujourd'hui il l'attend dans la response.
- `files[].id` : entier. `name` et `url` : strings.

---

#### `POST /api/messaging/messages`
Envoie un message (nouveau ou dans une conversation existante).

État actuel mobile : `POST /ajaxchat/sendmessage` avec Content-Type `application/x-www-form-urlencoded`. Le mobile envoie aujourd'hui un champ `files` qui contient un JSON stringifié `[{"file": <id>}, ...]` (héritage de l'API web). Cible : Content-Type `application/json` et champ `file_ids: number[]`.

**Request body (cible) :**
```json
{
  "correspondent_id": "42",
  "subject": "string (requis si nouvelle conversation)",
  "message": "string",
  "conversation_id": 7,
  "file_ids": [88, 89]
}
```

`conversation_id` optionnel : si absent, crée une nouvelle conversation. `correspondent_id` envoyé comme string (héritage backend).

**Response 201 :**
```json
{
  "messages": [ "<message créé>" ],
  "conversation_id": 7
}
```

`messages` : tableau d'objets au même shape que GET messages (avec `timetext` inclus).

---

#### `GET /api/messaging/contacts/statuses`
Récupère les statuts en ligne des contacts (polling régulier côté mobile).

État actuel mobile : `GET /ajaxchat/ping`.

**Response 200 :**
```json
{
  "42": "online",
  "43": "offline",
  "44": "away"
}
```

> Idéalement remplacer par un WebSocket / Pusher à terme.

---

#### `POST /api/messaging/status`
Définit le statut de présence de l'utilisateur courant.

État actuel mobile : `POST /ajaxchat/setstatus` avec Content-Type `application/x-www-form-urlencoded` et champ `value=...`. Cible : Content-Type JSON et champ `status`.

**Request body (cible) :**
```json
{ "status": "online" | "offline" | "away" | "dnd" }
```

**Response 204.**

---

#### `PATCH /api/messaging/conversations/:conversation_id/status`
Change le statut d'une conversation.

État actuel mobile : `POST /ajaxchat/setconversationstatus/:id` avec Content-Type `application/x-www-form-urlencoded` et champ `conversation_status=...`. Cible : PATCH JSON.

**Path param :** `conversation_id`.
**Request body (cible) :**
```json
{ "status": "pending" | "blocked" | "finished" }
```

**Response 204.**

---

#### `POST /api/upload/document`
Upload une pièce jointe à attacher à un message.

État actuel mobile : `POST /upload/document` (sans préfixe `/api`). À aligner.

**Request (multipart/form-data) :**
```
file: <fichier>
```

Contraintes :
- Taille max : **10 Mo**
- MIME autorisés : `application/pdf`, `image/*`, `application/msword`, `application/vnd.openxmlformats-officedocument.*`
- Antivirus scan côté serveur **obligatoire** (ClamAV ou équivalent - données HDS)

**Response 201 :**
```json
{ "file_id": 88, "url": "https://cdn.audya.fr/docs/88.pdf" }
```

Le mobile ne lit aujourd'hui que `file_id`. Le champ `url` peut être ajouté pour permettre une preview avant envoi (consommation côté UI à enrichir).

---

### Lot 7 - Questionnaires

> **État du mobile pour ce lot :** le mobile consomme actuellement les routes en **singulier** (`/api/questionnaire/...`) sur 3 des 4 endpoints. Cible REST en pluriel (`/api/questionnaires/...`). Le mobile s'alignera à la livraison.

#### `GET /api/questionnaires`
Liste tous les questionnaires disponibles pour l'utilisateur.

État actuel mobile : `GET /api/questionnaires` (pluriel, déjà conforme).

**Response 200 :**
```json
[
  {
    "id": "ersa",
    "title": "ERSA",
    "subtitle": "Échelle Réduite de Surdité Auto-évaluée",
    "description": "Description complète…",
    "questions": [
      {
        "id": "q1",
        "text": "Avez-vous des difficultés à entendre la TV ?",
        "type": "binary" | "scale10" | "vas" | "choice5",
        "options": [
          { "value": 0, "label": "Non" },
          { "value": 1, "label": "Oui" }
        ],
        "min_label": "Pas du tout",
        "max_label": "Beaucoup"
      }
    ]
  }
]
```

---

#### `GET /api/questionnaires/:id`
Récupère un questionnaire spécifique.

État actuel mobile : `GET /api/questionnaire/:id` (singulier). À aligner sur le pluriel.

**Path param :** `id`.
**Response 200 :** un seul objet `Questionnaire` (cf. shape ci-dessus).

---

#### `GET /api/questionnaires/:id/submissions`
Historique des soumissions de ce questionnaire par l'utilisateur.

État actuel mobile : `GET /api/questionnaire/:id/submissions` (singulier). À aligner.

**Path param :** `id`.
**Response 200 :**
```json
[
  {
    "id": "sub-uuid",
    "questionnaire_id": "ersa",
    "submitted_at": "2026-06-01T14:30:00Z",
    "answers": { "q1": 1, "q2": 7, "q3": 3 }
  }
]
```

Trier par `submitted_at` desc.

---

#### `POST /api/questionnaires/submit`
Soumet une réponse à un questionnaire.

État actuel mobile : `POST /api/questionnaire/submit` (singulier). À aligner.

**Request body :**
```json
{
  "questionnaire_id": "ersa",
  "answers": { "q1": 1, "q2": 7, "q3": 3 }
}
```

**Response 201 :** la submission créée (cf. shape précédent).

---

### Lot 8 - Notifications

#### `GET /api/notifications`
Liste les notifications de l'utilisateur.

**Response 200 :**
```json
[
  {
    "id": "notif-uuid",
    "title": "Nouveau message",
    "body": "Dr Martin vous a envoyé un message",
    "created_at": "2026-06-02T10:30:00Z",
    "read_at": null,
    "type": "message" | "appointment" | "questionnaire" | "info"
  }
]
```

Trier par `created_at` desc. Limiter à 50 entrées par défaut, paginer si besoin.

---

#### `PATCH /api/notifications/:id/read`
Marque une notification comme lue.

**Path param :** `id`.
**Response 204.**

---

#### `PATCH /api/notifications/read-all`
Marque toutes les notifications comme lues.

**Response 204.**

---

### Lot 9 - Carnet d'audition

#### `GET /api/patient/documents`
Liste les documents de suivi auditif.

État actuel mobile : `GET /my-documents` (sans préfixe `/api/patient`). À aligner.

**Response 200 :**
```json
{
  "documents": [
    {
      "id": 88,
      "author": "Dr Jean Martin",
      "created_at": "2026-05-15 14:30:00",
      "document_type": "audiogramme",
      "title": "Audiogramme initial",
      "description": "Bilan complet droite/gauche",
      "patient_name": "Marie Dupont",
      "file_url": "https://cdn.audya.fr/docs/88.pdf"
    }
  ]
}
```

**Types et conventions attendus côté mobile :**
- `id` : entier.
- `author`, `document_type`, `title`, `description` : strings.
- `patient_name` : string optionnel.
- `created_at` : format `YYYY-MM-DD HH:mm:ss`. **Important** : le mobile parse en splittant sur l'espace puis en reformatant en `DD/MM/YYYY` ; le format ISO 8601 avec séparateur `T` n'est PAS supporté actuellement. À fournir au format dépassé OU mobile à robustifier.
- `document_type` : string libre côté mobile, valeurs typiques attendues `"audiogramme" | "compte_rendu" | "ordonnance" | "autre"`.
- `file_url` : présent dans le type mobile mais non consommé par l'UI actuelle (à brancher pour le download).

> Le champ `side` (left/right) n'est PAS attendu de l'API : il est calculé côté mobile à partir du contenu de `author`. À ne pas renvoyer.

---

#### `DELETE /api/patient/documents/:document_id`
Supprime un document.

État actuel mobile : `POST /documents/delete` avec body JSON `{ "document_id": <id> }`. À aligner sur DELETE RESTful.

**Path param :** `document_id`.
**Response 204.**
**Response 403 :** si le document n'appartient pas au patient.

---

### Lot 10 - Actualités

#### `GET /api/news` (planifié)
Liste les articles d'actualité santé auditive.

État actuel mobile : `newsService.ts` est entièrement en mock, aucune fonction n'appelle l'API. Sera branché en phase 2 dès livraison backend.

**Response 200 (cible) :**
```json
[
  {
    "id": 1,
    "category": "Prévention",
    "title": "Les bons réflexes pour préserver son audition",
    "excerpt": "Courte introduction",
    "content": "Contenu complet de l'article (markdown ou HTML sanitisé)",
    "date": "2026-05-20",
    "read_minutes": 3
  }
]
```

**Types attendus côté mobile :**
- `id` : entier.
- `date` : format `YYYY-MM-DD`.
- `read_minutes` : entier.
- Tous les autres champs : strings.

Public (pas besoin d'auth). À mettre derrière `auth:sanctum` quand même si on veut tracker le lectorat.

---

### Lot 11 - Chatbot AUDYA

#### `POST /api/chatbot/message`
Envoie un message à l'assistant IA AUDYA.

**Request body :**
```json
{ "message": "Bonjour, j'ai mal à l'oreille droite" }
```

**Response 200 :**
```json
{ "reply": "Je suis désolé d'entendre cela. ..." }
```

Le mobile ne consomme aujourd'hui que `reply`. Un champ optionnel `conversation_id` pourra être ajouté ultérieurement pour gérer la persistance multi-tours (consommation côté mobile à enrichir).

> Données potentiellement sensibles (questions médicales) - bien isoler du training data si LLM tiers.

---

### Lot 12 - Inscription

> **État du mobile pour ce lot :** seuls les 2 premiers endpoints (`POST /api/register` et `POST /api/register/verify-email`) sont effectivement appelés. Les 4 suivants (patient-info, hearing-survey, medical-info, professional) correspondent aux étapes 2-5 du wizard mobile mais leurs handlers ne contiennent que des TODOs en attente de cette livraison. À implémenter côté mobile en phase 2.

#### `POST /api/register`
Crée un compte patient (étape 1 : identité + mot de passe + CGV).

**Request body :**
```json
{
  "nom": "string",
  "prenom": "string",
  "email": "string",
  "mot_de_passe": "string",
  "cgv": true,
  "contact": "oui" | "non"
}
```

**Response 201 :**
```json
{ "message": "Un email de vérification vous a été envoyé." }
```

Le compte est créé en état `unverified`. L'utilisateur doit cliquer sur le lien dans l'email pour activer le compte (ou utiliser l'étape ci-dessous).

---

#### `POST /api/register/verify-email`
Renvoie l'email de vérification (étape 1bis).

État actuel mobile : Content-Type `application/x-www-form-urlencoded` (`email=...`). Cible : JSON. À aligner.

**Request body (cible) :**
```json
{ "email": "string" }
```

**Response 200 :** `{ "message": "Email renvoyé." }`

Rate limit recommandé : 3 envois / 5 min / email.

---

#### `POST /api/register/patient-info` (planifié)
Soumet les informations personnelles (étape 2). État actuel mobile : aucun appel, TODO dans `RegisterStep2Page.tsx`.

**Request body :**
```json
{
  "genre": "homme" | "femme",
  "date_naissance": "1988-04-11",
  "numero_secu": "string",
  "adresse": "string",
  "complement": "string",
  "code_postal": "string",
  "ville": "string",
  "pays": "string",
  "telephone_fixe": "string",
  "telephone_mobile": "string",
  "profession": "string",
  "photo_url": "string (optionnel - issu de upload-photo)"
}
```

> `numero_secu` : RGPD ultra-sensible, chiffrement au repos en DB **obligatoire**.

**Response 200 :** `{ "message": "Informations sauvegardées." }`

---

#### `POST /api/register/hearing-survey` (planifié)
Soumet le questionnaire auditif d'inscription (étape 3). État actuel mobile : aucun appel, TODO dans `RegisterStep3Page.tsx`.

**Request body :**
```json
{
  "duree_gene": "string",
  "oui_non": ["string", "..."],
  "evolution_surdite": "string",
  "situations_difficiles": ["string", "..."],
  "situations_difficiles_bis": ["string", "..."]
}
```

**Response 200 :** `{ "message": "Questionnaire sauvegardé." }`

---

#### `POST /api/register/medical-info` (planifié)
Soumet les informations médicales (étape 4). État actuel mobile : aucun appel, TODO dans `RegisterStep4Page.tsx`.

**Request body :**
```json
{
  "taille": "string",
  "poids": "string",
  "groupe_sanguin": "string",
  "antecedents": "string",
  "traitements": "string",
  "allergies": "string"
}
```

> Données HDS - conformité requise.

**Response 200 :** `{ "message": "Informations médicales sauvegardées." }`

---

#### `POST /api/register/professional` (planifié)
Associe un professionnel de santé pendant l'inscription (étape 5). État actuel mobile : aucun appel, TODO dans `RegisterStep5Page.tsx`.

**Request body :**
```json
{
  "professional_id": 42,
  "consent_data_share": true
}
```

`consent_data_share` doit être `true` (RGPD Art. 9).

**Response 200 :** `{ "message": "Professionnel associé." }`

---

### Lot 13 - Mot de passe oublié

#### `POST /api/auth/forgot-password`
Déclenche l'envoi d'un email de réinitialisation.

**Request body :**
```json
{ "email": "string" }
```

**Response 200 :** `{ "message": "Email envoyé si le compte existe." }`

> Renvoyer **toujours** le même message (existe / n'existe pas) pour ne pas leaker l'existence d'un compte.

Rate limit recommandé : 3 / 15 min / email.

---

#### `POST /api/auth/reset-password`
Réinitialise le mot de passe avec le token reçu par email.

**Request body :**
```json
{
  "token": "string",
  "password": "string",
  "password_confirmation": "string"
}
```

**Response 200 :** `{ "message": "Mot de passe réinitialisé." }`
**Response 422 :** si le token est invalide / expiré.

---

## 5. Considérations sécurité transversales

Au-delà des contraintes par endpoint, les points suivants concernent **l'ensemble de l'API mobile** :

### 5.1 Token Sanctum

- Durée de vie limitée (8h annoncé via `expires_at`)
- **À confirmer** : révocation au `logout`
- **À confirmer** : respect strict de `expires_at` (rejet automatique des tokens expirés)
- **À confirmer** : invalidation des autres tokens d'un user après `change-password`

### 5.2 Filtrage des réponses (Laravel Resources)

**Chaque endpoint DOIT passer par un Resource qui whitelist explicitement les champs publics.** Le mobile ne doit jamais recevoir :
- Mots de passe, hashes
- Codes 2FA, tokens magic-link
- Numéros de sécurité sociale (sauf endpoint dédié au patient lui-même, et chiffré au repos)
- Identifiants Stripe, données de facturation
- Notes internes, statuts métier non publics
- Données d'autres utilisateurs

### 5.3 Rate limiting

| Endpoint | Limite recommandée |
|---|---|
| `/api/auth/login` | 5 / min / IP (déjà en place) |
| `/api/auth/verify-2fa` | **10 tentatives / pending_token**, puis invalidation |
| `/api/auth/resend-code` | 3 / 5 min / pending_token |
| `/api/auth/forgot-password` | 3 / 15 min / email |
| `/api/professionals/search` | 30 / min / user |
| Autres GET | 60 / min / user (default) |
| Autres POST/PATCH | 30 / min / user |

### 5.4 Autorisation au niveau ressource

Chaque endpoint qui accède à une ressource appartenant à l'utilisateur doit vérifier la propriété :
```php
if ($event->patient_id !== auth()->id()) {
abort(403);
}
```

Ne **jamais** se contenter de l'auth Sanctum pour exposer une ressource - il faut aussi vérifier que le user authentifié est bien propriétaire.

### 5.5 HDS - Hébergement de Données de Santé

Les endpoints suivants exposent des données de santé soumis à la certification HDS :
- `GET /api/patient/health`
- `GET /api/patient/documents`
- `POST /api/messaging/messages` (peut contenir du contexte médical)
- `POST /api/chatbot/message` (peut contenir des questions médicales)
- `POST /api/questionnaires/submit`
- `POST /api/register/medical-info` (planifié)

Confirmer la conformité HDS de l'hébergement backend (et du chatbot s'il s'appuie sur un LLM tiers).

### 5.6 CORS

Pour l'app mobile native, **pas besoin de CORS** (pas de navigateur). Mais si l'API est aussi utilisée depuis le web, configurer CORS strictement (whitelist des domaines, pas `*`).

---

## 6. Proposition de découpage par phases de livraison

Pour étaler la charge backend et permettre des livraisons mobile incrémentales. Les nombres entre parenthèses correspondent aux endpoints du Lot inventorié en section 4.

| Phase | Périmètre | Endpoints | Effort estimé | Priorité |
|---|---|---|---|---|
| **Phase 0 - Auth** | `/api/auth/*` | 4 (livré) | - | - |
| **Phase 1 - Profil & paramètres** | Lot 1 (3) + Lot 2 (4) | 7 | 1 semaine | Haute (foundation) |
| **Phase 2 - Médical** | Lot 3 (1) + Lot 9 (2) + Lot 7 (4) | 7 | 1.5 semaine | Haute (cœur métier) |
| **Phase 3 - Professionnels** | Lot 4 (3 actifs + 2 planifiés) | 5 | 1 semaine | Moyenne |
| **Phase 4 - Messagerie** | Lot 6 (7) | 7 | 2 semaines | Moyenne (le plus complexe) |
| **Phase 5 - Agenda** | Lot 5 (3) | 3 | 1 semaine | Moyenne |
| **Phase 6 - Notifications & News** | Lot 8 (3) + Lot 10 (1 planifié) | 4 | 0.5 semaine | Basse |
| **Phase 7 - Chatbot** | Lot 11 (1) | 1 | 0.5 semaine | Basse (dépend de la solution IA choisie) |
| **Phase 8 - Inscription & reset** | Lot 12 (2 actifs + 4 planifiés) + Lot 13 (2) | 8 | 1.5 semaine | Moyenne (en parallèle des phases 1-2) |
| **TOTAL** | | **42 endpoints** | **8 à 10 semaines** | |

**Note sur le découpage actif vs planifié :** sur les 42 endpoints, 35 sont consommés aujourd'hui par le mobile (via les routes web actuelles à remplacer par les routes API REST cibles). Les 7 marqués `(planifié)` correspondent à des écrans dont le branchement mobile est prévu en phase 2 ; ils peuvent être livrés en dernier sans bloquer le mobile.

**Total estimé : 8 à 10 semaines** selon la disponibilité de l'équipe backend et la profondeur des tests.

L'app mobile peut être livrée au client de manière incrémentale au fur et à mesure : un lot livré côté backend = un commit côté mobile qui bascule le `USE_*_API=true` correspondant + tests d'intégration.

---

## 7. Points ouverts à clarifier

Avant le démarrage du chantier, les questions suivantes nécessitent une décision :

1. **Notifications push** : faut-il prévoir des endpoints `POST /api/devices/register` et `DELETE /api/devices/:id` pour stocker les tokens FCM/APNS du mobile ? Si oui, à ajouter au cahier des charges.
2. **WebSockets pour la messagerie** : le polling sur `/api/messaging/contacts/statuses` est-il acceptable v1, ou faut-il prévoir Pusher / Reverb dès le départ ?
3. **Pagination** : Aujourd'hui les listes (notifications, professionnels, événements) renvoient tout. À partir de quel volume passer à `?page=N&per_page=20` ?
4. **Versioning de l'API** : préfixer en `/api/v1/*` dès maintenant pour permettre des évolutions futures sans casser le mobile installé ?
5. **Documentation auto-générée** : générer une doc Swagger / OpenAPI côté backend pour faciliter les tests mobile et la maintenance ?

---

## 8. Contact

Côté mobile, le code est à jour sur le dépôt projet, branche `main`. Les services correspondants se trouvent dans `src/services/` et contiennent les contrats actuels avec les types TypeScript détaillés.

Toute question ou demande d'éclaircissement sur le shape d'un endpoint : ouvrir un ticket / mail / contact équipe mobile.

Merci pour votre travail.
