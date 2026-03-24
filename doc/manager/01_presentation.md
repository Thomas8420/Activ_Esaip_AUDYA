# 01 — Présentation du projet AUDYA

## Vision

AUDYA est une application mobile de suivi audiologique destinée aux patients appareillés. Elle centralise les informations médicales, facilite la coordination avec les professionnels de santé, et accompagne le patient au quotidien grâce à un assistant IA intégré.

---

## Contexte & Enjeux

| Enjeu | Réponse AUDYA |
|-------|--------------|
| Suivi post-appareillage souvent insuffisant | Accès immédiat aux données de santé et à l'agenda de suivi |
| Communication fragmentée entre patient et praticien | Messagerie sécurisée centralisée |
| Questionnaires de suivi (ERSA, EQ-5D-5L) mal remplis | Formulaires guidés, historique et export |
| Patient isolé entre les rendez-vous | Assistant IA disponible 24h/24 |

---

## Utilisateurs cibles

| Profil | Rôle dans l'app |
|--------|----------------|
| **Patient** | Utilisateur principal — consulte ses données, remplit les questionnaires, communique avec ses praticiens |
| **Professionnel de santé** (audioprothésiste, médecin…) | Référent suivi — reçoit les données, répond aux messages, planifie les RDV |
| **Administrateur AUDYA** | Gestion de la plateforme (hors scope front mobile) |

---

## Plateformes

| Plateforme | Statut |
|------------|--------|
| iOS (iPhone) | ✅ Supporté |
| Android | ✅ Supporté |
| Web | ❌ Hors scope |

---

## Sécurité & Conformité

- Authentification à deux facteurs (2FA) obligatoire
- Toutes les communications passent par HTTPS
- Cookies de session HTTP (aucune donnée sensible en local storage)
- Données de santé non stockées en clair sur l'appareil
- Prêt pour conformité RGPD : liens légaux intégrés (mentions légales, politique RGPD, cookies)

---

## Architecture technique (résumé)

L'application est développée en **React Native** (iOS + Android depuis une base de code unique), avec **TypeScript** pour la robustesse du code. Elle communique avec une API backend via HTTPS. Toutes les fonctionnalités sont développées en mode "maquette fonctionnelle" (mock) en attente de la finalisation du backend.

---

## Charte graphique

Couleurs principales imposées par le client :

| Couleur | Usage |
|---------|-------|
| **Orange** `#E8622A` | Boutons principaux, accents, navigation |
| **Teal** `#3ABFBF` | Assistant IA (FAB), indicateurs de validation |
| **Fond clair** `#f5f3ef` | Fond général de l'application |

Typographie : **Montserrat** (Regular, SemiBold, Bold)

---

## Internationalisation

L'application est disponible en **3 langues** dès le lancement :

| Langue | Code | Complète |
|--------|------|----------|
| Français | `FR` | ✅ |
| Anglais | `EN` | ✅ |
| Espagnol | `ES` | ✅ |

Le changement de langue est instantané depuis l'écran Paramètres.
