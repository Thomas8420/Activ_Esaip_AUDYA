# 05 — Composants & Charte graphique

## Charte graphique — Palette imposée client

> ⚠️ Ne jamais modifier les valeurs hexadécimales. Ces couleurs sont contractuelles.

**Fichier source :** `src/screens/Home/HomeScreen.styles.tsx`

```typescript
export const COLORS = {
  orange:      '#E8622A',   // Couleur primaire (boutons, accents, bottom nav)
  orangeLight: '#F0936B',   // Variante hover/pressed
  teal:        '#3ABFBF',   // FAB chatbot, indicateurs de validation
  white:       '#FFFFFF',   // Fonds, textes sur fond coloré
  offWhite:    '#F8F9FA',   // Fond léger (lignes non lues, background secondaire)
  tile:        '#FFFFFF',   // Tuiles d'accueil
  text:        '#2D2D2D',   // Texte principal
  textLight:   '#6B6B6B',   // Texte secondaire, placeholders
  border:      '#E0E0E0',   // Séparateurs
  background:  '#f5f3ef',   // Fond général de l'app
  overlay:     'rgba(0,0,0,0.4)', // Overlay modal/dropdown
};
```

### Couleurs dérivées approuvées (usage interne uniquement)

| Valeur | Usage |
|--------|-------|
| `#FEF3EE` | Fond sélectionné (boutons binary, choice5) |
| `#E8F8F8` | Fond icône teal (badges, cards) |
| `#F0F0F0` | Fond neutre (badges history, boutons désactivés) |

### Palette Auth (`src/styles/auth/colors.ts`)
Palette distincte pour les écrans de connexion/inscription. Ne pas mélanger avec la palette principale.

---

## Typographie

**Toujours importer depuis `src/screens/Home/HomeScreen.styles.tsx`** :

```typescript
import { FONT_REGULAR, FONT_SEMIBOLD, FONT_BOLD } from '../../screens/Home/HomeScreen.styles';
```

| Constante | Valeur | Usage |
|-----------|--------|-------|
| `FONT_REGULAR` | `'Montserrat-Regular'` | Corps de texte |
| `FONT_SEMIBOLD` | `'Montserrat-SemiBold'` | Sous-titres, labels |
| `FONT_BOLD` | `'Montserrat-Bold'` | Titres, valeurs importantes |

---

## Composants communs (à réutiliser systématiquement)

| Composant | Fichier | Usage |
|-----------|---------|-------|
| `NavBar` | `src/components/common/NavBar/NavBar.tsx` | Top bar toutes les screens authentifiées |
| `NotificationPanel` | `src/components/common/NavBar/NotificationPanel.tsx` | Panel notifications (rendu par NavBar) |
| `BottomNav` | `src/components/common/BottomNav/BottomNav.tsx` | Bottom bar toutes les screens authentifiées |
| `Fab` | `src/components/common/Button/Fab.tsx` | Intégré dans BottomNav |
| `ChatbotModal` | `src/components/Chatbot/ChatbotModal.tsx` | Intégré dans BottomNav |

---

## Inventaire complet des composants Page

### MainPage
`src/components/MainPage/MainPage.tsx`
Grille 2×4 de tuiles, bannière image, footer légal. Utilise `useNavigation` + `useLanguage`.

### Professionals
| Composant | Rôle |
|-----------|------|
| `ProfessionalsPage` | Orchestrateur liste filtrée (recherche, spécialité, CP, ville) |
| `ProfessionalsFilters` | UI filtres + toggle vue carte/liste |
| `ProfessionalCard` | Vue carte (nom, spécialité, statut invitation, actions) |
| `ProfessionalListRow` | Vue ligne tableau |
| `ProfessionalProfilePage` | Détail professionnel (coordonnées, historique) |
| `AddProfessionalPage` | Formulaire ajout avec validation |
| `InviteProfessionalPage` | Formulaire invitation + consentement |

### Settings
`src/components/Settings/SettingsPage.tsx`
4 sections : Préférences (langue FR/EN/ES, format date/heure), Notifications, Mot de passe, Compte.
Changement de langue **immédiat** via `LanguageContext.setLanguage()`.

### Profile
`src/components/Profile/ProfilePage.tsx`
Gestion profil utilisateur : nom, photo (upload via `react-native-image-picker`), informations personnelles.

### Messaging
| Composant | Rôle |
|-----------|------|
| `MessagingPage` | Liste conversations avec statut (en attente, bloqué, terminé) |
| `MessagingChatPage` | Vue conversation + envoi messages + pièces jointes |

### Agenda
| Composant | Rôle |
|-----------|------|
| `AgendaPage` | Calendrier mois/semaine/jour |
| `AgendaDayViewPage` | Timeline horaire 6h–22h, ligne heure actuelle, ajout/édition event |
| `AgendaFormPage` | Formulaire création/édition événement |

### Health
`src/components/Health/HealthPage.tsx`
Résumé santé : calcul IMC, QR Code, antécédents médicaux, documents.

### Appareillage
| Composant | Rôle |
|-----------|------|
| `AppareillagePage` | Liste appareils auditifs + historique + modal détail |
| `DeviceCard` | Carte appareil (côté gauche/droit, marque, modèle) |

### Questionnaire
| Composant | Rôle |
|-----------|------|
| `QuestionnairePage` | Liste ERSA + EQ-5D-5L avec statut (jamais complété / N complétions) |
| `QuestionnaireDetailPage` | Formulaire (binary/scale10/vas/choice5) + historique dépliable + export Share natif |

### News
`src/components/News/NewsPage.tsx`
6 articles santé auditive + modal lecture plein écran + partage natif.

### Chatbot
`src/components/Chatbot/ChatbotModal.tsx`
Modal assistant AUDYA (slide from bottom). Bulles de conversation avec icône par rôle.

### Flux Register
| Composant | Rôle |
|-----------|------|
| `RegisterFlow` | Routeur inscription + montage des providers séparés |
| `RegisterStep1Page` | Identité, MDP, CGV — validation complète (email, force MDP) |
| `RegisterStep1BisPage` | Attente vérification e-mail |
| `RegisterStep2Page` | Infos personnelles + upload photo |
| `RegisterStep3Page` | Questionnaire auditif (durée, situations difficiles) |
| `RegisterStep4Page` | Informations médicales (IMC, antécédents, traitements) |
| `RegisterStep5Page` | Recherche professionnel de santé |
| `RegisterSuccessPage` | Félicitations → retour login |

---

## Conventions StyleSheet

```typescript
// ✅ StyleSheet.create() OBLIGATOIRE (pas de style inline)
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,  // token COLORS
    fontFamily: FONT_REGULAR,            // token FONT_*
  },
});

// ✅ Responsive via Dimensions
const { width } = Dimensions.get('window');

// ✅ Ombres cross-platform
shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.07,
shadowRadius: 6,
elevation: 2, // Android
```

---

## Accessibilité (obligatoire)

Tout élément interactif doit avoir :

```tsx
<TouchableOpacity
  accessibilityLabel="Description explicite de l'action"
  accessibilityRole="button"  // ou "radio", "switch", "link"
>
```
