# 02 — Fonctionnalités par écran

## Vue d'ensemble

L'application AUDYA est organisée autour d'un menu principal accessible depuis n'importe quel écran. Le patient dispose de 8 grandes sections :

```
Accueil
 ├── Ma Santé
 ├── Mon Appareillage
 ├── Mon Carnet Audition
 ├── Mes Professionnels
 ├── Mon Agenda
 ├── Ma Messagerie
 └── Mes Questionnaires
     + Actualités (news)
     + Assistant IA (chatbot)
```

---

## Connexion & Inscription

### Connexion
- Saisie e-mail + mot de passe
- Vérification en deux étapes (2FA) par code
- Récupération de mot de passe par e-mail

### Inscription (5 étapes guidées)
| Étape | Contenu |
|-------|---------|
| 1 | Création de compte (identité, mot de passe, acceptation CGV) |
| 1bis | Vérification de l'adresse e-mail (lien cliqué) |
| 2 | Informations personnelles (genre, adresse, photo de profil) |
| 3 | Questionnaire auditif initial (durée, situations difficiles) |
| 4 | Informations médicales (taille, poids, groupe sanguin, antécédents) |
| 5 | Recherche et ajout d'un professionnel de santé référent |

---

## Accueil

- Grille des 8 tuiles de navigation rapide
- Bannière visuelle AUDYA
- Footer légal (mentions légales, RGPD, cookies, contact)

---

## Ma Santé

- Affichage de l'IMC calculé automatiquement (taille + poids)
- QR Code d'identification médicale
- Antécédents médicaux
- Documents médicaux (liste)

---

## Mon Appareillage

- Liste des appareils auditifs (gauche / droite)
- Informations : marque, modèle, date de pose
- Historique des interventions par appareil
- Modal de détail par appareil

---

## Mes Professionnels

- Liste des professionnels de santé rattachés au patient
- Recherche par nom, spécialité, code postal, ville
- Vue carte ou vue tableau (bascule)
- Actions : voir le profil, envoyer un message, inviter un professionnel, renvoyer une invitation
- Statut de chaque professionnel : actif, invitation en attente
- Ajout d'un nouveau professionnel (formulaire avec validation)
- Invitation d'un professionnel externe (formulaire + consentement)

---

## Mon Agenda

- Calendrier mensuel, hebdomadaire, journalier
- Vue timeline horaire (6h–22h) avec ligne "heure actuelle"
- Ajout et édition d'événements (titre, date, heure, description)
- Suppression d'événements

---

## Ma Messagerie

- Liste des conversations avec les professionnels de santé
- Statut des conversations : active, en attente, bloquée, terminée
- Vue conversation complète avec bulles de messages
- Envoi de messages texte
- Envoi de pièces jointes (documents)

---

## Mes Questionnaires

### Types de questionnaires disponibles
| Questionnaire | Description |
|---------------|-------------|
| **ERSA** | Évaluation de la Réduction du Sentiment d'Audition |
| **EQ-5D-5L** | Qualité de vie générale (5 dimensions) |

### Fonctionnalités
- Liste des questionnaires avec statut (jamais complété / N complétions)
- Formulaire guidé par type de question :
  - Oui/Non (binary)
  - Échelle 0–10 (scale10)
  - Échelle visuelle analogique 0–100 (VAS)
  - Choix multiple texte (choice5)
- Historique des soumissions précédentes (dépliable)
- Export du résultat (partage natif iOS/Android)

---

## Mes Actualités

- 6 articles sur la santé auditive
- Lecture plein écran
- Partage natif d'article (iOS/Android)

---

## Assistant IA (Chatbot AUDYA)

- Accessible depuis n'importe quel écran (bouton flottant teal)
- Modal slide-from-bottom
- Bulles de conversation avec identification du rôle (patient / assistant)
- Réponses contextuelles sur la santé auditive et l'utilisation de l'app

---

## Notifications

- Cloche dans la barre supérieure avec badge de comptage (notifications non lues)
- Panel de notifications (overlay semi-transparent)
- Types : message reçu, rendez-vous, questionnaire à remplir, information
- Marquage individuel ou global comme "lu"
- Distinction visuelle claire : non lues (fond blanc) / lues (fond gris)

---

## Mon Profil

- Affichage et modification du profil utilisateur
- Changement de la photo de profil (depuis la galerie ou l'appareil photo)
- Informations personnelles modifiables

---

## Mes Paramètres

| Section | Fonctionnalités |
|---------|----------------|
| Préférences | Langue (FR / EN / ES — changement immédiat), format date, format heure |
| Notifications | Activation/désactivation par type (messages, RDV, questionnaires, actualités) |
| Mot de passe | Modification du mot de passe |
| Compte | Suppression du compte (avec confirmation) |
