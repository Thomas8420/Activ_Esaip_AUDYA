# 03 — Tableau de bord d'avancement

> Dernière mise à jour : Mars 2026

---

## Résumé exécutif

| Catégorie | Statut |
|-----------|--------|
| Interface utilisateur (front mobile) | ✅ Complète |
| Connexion au backend (API) | ⏳ En attente du backend |
| Tests automatisés | 🔄 Partiels (couverture prioritaire faite) |
| Documentation | ✅ Complète |

L'intégralité de l'interface mobile est **développée et fonctionnelle** en mode de démonstration (données simulées). Le branchement sur le backend réel est en attente de la finalisation des API serveur — une fois prêtes, chaque module peut être connecté indépendamment en **une demi-journée**.

---

## Avancement par écran

### Authentification

| Écran | Front | API |
|-------|-------|-----|
| Connexion (email + mot de passe) | ✅ | ✅ Partiel |
| Vérification 2FA | ✅ | ✅ Partiel |
| Récupération de mot de passe | ✅ | ⏳ |
| Inscription — Étape 1 (création compte) | ✅ | ⏳ |
| Inscription — Étape 1bis (vérification e-mail) | ✅ | ⏳ |
| Inscription — Étape 2 (infos personnelles) | ✅ | ⏳ |
| Inscription — Étape 3 (questionnaire auditif) | ✅ | ⏳ |
| Inscription — Étape 4 (infos médicales) | ✅ | ⏳ |
| Inscription — Étape 5 (choix professionnel) | ✅ | ⏳ |
| Écran succès inscription | ✅ | — |

### Application principale

| Écran | Front | API | Notes |
|-------|-------|-----|-------|
| Accueil (grille + bannière) | ✅ | — | Navigation pure |
| Notifications (panel + badge) | ✅ | ⏳ | 4 notifications mock |
| Ma Santé | ✅ | ⏳ | |
| Mon Appareillage | ✅ | ⏳ | Mock statique |
| Mon Carnet Audition | ✅ | ⏳ | Mock statique |
| Mes Professionnels (liste + filtres) | ✅ | ⏳ | Format JSON à confirmer |
| Profil professionnel (détail) | ✅ | ⏳ | |
| Ajout professionnel | ✅ | ⏳ | |
| Invitation professionnel | ✅ | ⏳ | |
| Mon Agenda (calendrier) | ✅ | ⏳ | |
| Agenda — Vue jour | ✅ | ⏳ | |
| Agenda — Formulaire événement | ✅ | ⏳ | |
| Ma Messagerie (liste conversations) | ✅ | ⏳ | |
| Ma Messagerie (conversation) | ✅ | ⏳ | |
| Mes Questionnaires (liste) | ✅ | ⏳ | |
| Mes Questionnaires (formulaire + historique) | ✅ | ⏳ | |
| Mes Actualités | ✅ | ⏳ | |
| Assistant IA (chatbot) | ✅ | ⏳ | |
| Mon Profil | ✅ | ⏳ | |
| Mes Paramètres | ✅ | ⏳ | Langue fonctionnelle |

---

## Légende

| Symbole | Signification |
|---------|--------------|
| ✅ | Terminé et fonctionnel |
| ⏳ | En attente (backend non prêt) |
| 🔄 | En cours |
| ❌ | Bloqué |
| — | Non applicable |

---

## Dépendances bloquantes

### Backend (côté serveur)

Tous les modules front sont prêts. Le passage en production dépend uniquement de la disponibilité des API backend. Pour chaque module, le basculement se fait en changeant **un seul flag** dans le code (`USE_XXX_API = true`) et en validant le format de données retourné.

| Module | Endpoint principal | Priorité |
|--------|-------------------|----------|
| Inscription | `POST /api/register` (+ 5 sous-endpoints) | 🔴 Haute |
| Authentification complète | `POST /api/auth/login`, `POST /api/auth/2fa` | 🔴 Haute |
| Professionnels | `GET /api/patient/professionals` | 🔴 Haute |
| Messagerie | `GET /ajaxchat/getconversations` | 🟡 Moyenne |
| Questionnaires | `GET /api/questionnaires` | 🟡 Moyenne |
| Agenda | `GET /my-events` | 🟡 Moyenne |
| Santé / Profil / Paramètres | Voir doc technique | 🟢 Normale |
| Actualités | `GET /api/news` | 🟢 Normale |
| Chatbot | `POST /api/chatbot/message` | 🟢 Normale |
| Notifications | `GET /api/notifications` | 🟢 Normale |

### Dépendance package mobile

Un package supplémentaire est à installer avant la mise en production :

```
@react-native-async-storage/async-storage
```

Ce package est nécessaire pour la **persistance inter-sessions** de la langue choisie, des notifications lues et des soumissions de questionnaire (actuellement conservées uniquement le temps de la session).

---

## Tests automatisés

| Domaine | Couverture |
|---------|-----------|
| Navigation (routeur) | ✅ |
| Authentification | ✅ |
| Professionnels (liste, filtres) | ✅ |
| API HTTP (timeout, erreurs) | ✅ |
| Formulaire inscription (5 étapes) | ✅ |
| Utilitaires agenda | ✅ |
| Validation e-mail | ✅ |
| Internationalisation (i18n) | ⏳ À faire |
| Notifications | ⏳ À faire |
| Questionnaires | ⏳ À faire |

---

## Prochaines étapes recommandées

1. **Finaliser les API backend** — priorité inscription + auth + professionnels
2. **Valider les formats JSON** avec l'équipe backend pour chaque endpoint
3. **Installer `@react-native-async-storage/async-storage`** pour la persistance inter-sessions
4. **Compléter les tests** : i18n, notifications, questionnaires
5. **Tests utilisateurs** sur les flux d'inscription et de questionnaire
6. **Recette client** sur les données réelles avant mise en production
