// src/i18n/translations.ts
// Toutes les chaînes traduisibles de l'application.
// Pour ajouter une langue : dupliquer un bloc et renseigner toutes les clés.
// Pour ajouter une clé : l'ajouter dans les 3 langues.

export type Language = 'FR' | 'EN' | 'ES';

type TranslationMap = Record<string, string>;

const FR: TranslationMap = {
  // ── Menu principal (tuiles + popup BottomNav) ──────────────────────────
  'menu.health':         'Ma santé',
  'menu.hearing':        'Mon appareillage',
  'menu.notebook':       'Mon carnet audition',
  'menu.professionals':  'Mes professionnels',
  'menu.agenda':         'Mon agenda',
  'menu.message':        'Ma messagerie',
  'menu.questionnaire':  'Mes questionnaires',
  'menu.news':           'Mes actualités',

  // ── Labels section (BottomNav centre) ─────────────────────────────────
  'screen.home':              'Accueil',
  'screen.health':            'Ma santé',
  'screen.professionals':     'Mes professionnels',
  'screen.settings':          'Mes paramètres',
  'screen.profile':           'Mon profil',
  'screen.messaging':         'Ma messagerie',
  'screen.agenda':            'Mon agenda',
  'screen.notebook':          'Mon carnet audition',
  'screen.hearing':           'Mon appareillage',
  'screen.questionnaire':     'Mes questionnaires',
  'screen.news':              'Mes actualités',
  'screen.menu':              'Menu',

  // ── NavBar ─────────────────────────────────────────────────────────────
  'navbar.notifications':   'Notifications',
  'navbar.settings':        'Paramètres',
  'navbar.profileMenu':     'Menu profil',
  'navbar.profile':         'Profil',
  'navbar.preferences':     'Préférences',
  'navbar.logout':          'Déconnexion',

  // ── BottomNav ──────────────────────────────────────────────────────────
  'bottomnav.home':      'Accueil',
  'bottomnav.openMenu':  'Ouvrir le menu',
  'bottomnav.assistant': 'Assistant AUDYA',

  // ── MainPage ───────────────────────────────────────────────────────────
  'main.banner':           'Audya simplifie le suivi patient et renforce la coordination pluridisciplinaire',
  'main.footer.copyright': '© {year} AUDYA — Tous droits réservés',
  'main.footer.legal':     'Mentions légales',
  'main.footer.rgpd':      'RGPD',
  'main.footer.cookies':   'Cookies',
  'main.footer.contact':   'Nous contacter',

  // ── Paramètres ─────────────────────────────────────────────────────────
  'settings.title':                 'MES PARAMÈTRES',
  'settings.preferences':           'Préférences',
  'settings.language':              'Langue',
  'settings.date':                  'Date',
  'settings.time':                  'Heure',
  'settings.notifications':         'Notifications',
  'settings.notif.messages':        'Notifications de messages',
  'settings.notif.alerts':          "Notifications d'alertes",
  'settings.notif.tasks':           'Notifications de tâches',
  'settings.password':              'Mon mot de passe',
  'settings.password.new':          'Nouveau mot de passe',
  'settings.password.confirm':      'Confirmation du mot de passe',
  'settings.password.mismatch':     'Les mots de passe ne correspondent pas.',
  'settings.password.change':       'Modifier le mot de passe',
  'settings.password.changing':     'Modification…',
  'settings.password.show':         'Afficher le mot de passe',
  'settings.password.hide':         'Masquer le mot de passe',
  'settings.password.showConfirm':  'Afficher la confirmation',
  'settings.password.hideConfirm':  'Masquer la confirmation',
  'settings.account':               'Mon compte',
  'settings.account.delete':        'Supprimer mon compte',
  'settings.save':                  'Enregistrer les modifications',
  'settings.saving':                'Enregistrement…',

  // ── Modal suppression compte ───────────────────────────────────────────
  'modal.delete.text':    'Voulez-vous vraiment supprimer votre compte ?',
  'modal.delete.cancel':  'Annuler',
  'modal.delete.confirm': 'Oui',

  // ── Erreurs ────────────────────────────────────────────────────────────
  'error.load':     'Impossible de charger les paramètres.',
  'error.save':     'Impossible de sauvegarder les paramètres.',
  'error.password': 'Impossible de changer le mot de passe.',
  'error.delete':   'Impossible de supprimer le compte.',
};

const EN: TranslationMap = {
  // ── Menu principal ─────────────────────────────────────────────────────
  'menu.health':         'My health',
  'menu.hearing':        'My hearing aids',
  'menu.notebook':       'My hearing log',
  'menu.professionals':  'My professionals',
  'menu.agenda':         'My agenda',
  'menu.message':        'My messages',
  'menu.questionnaire':  'My Forms',
  'menu.news':           'News',

  // ── Labels section ─────────────────────────────────────────────────────
  'screen.home':              'Home',
  'screen.health':            'My health',
  'screen.professionals':     'My professionals',
  'screen.settings':          'My settings',
  'screen.profile':           'My profile',
  'screen.messaging':         'My messages',
  'screen.agenda':            'My agenda',
  'screen.notebook':          'My hearing log',
  'screen.hearing':           'My hearing aids',
  'screen.questionnaire':     'My Forms',
  'screen.news':              'News',
  'screen.menu':              'Menu',

  // ── NavBar ─────────────────────────────────────────────────────────────
  'navbar.notifications':   'Notifications',
  'navbar.settings':        'Settings',
  'navbar.profileMenu':     'Profile menu',
  'navbar.profile':         'Profile',
  'navbar.preferences':     'Preferences',
  'navbar.logout':          'Logout',

  // ── BottomNav ──────────────────────────────────────────────────────────
  'bottomnav.home':      'Home',
  'bottomnav.openMenu':  'Open menu',
  'bottomnav.assistant': 'AUDYA Assistant',

  // ── MainPage ───────────────────────────────────────────────────────────
  'main.banner':           'Audya simplifies patient monitoring and strengthens multidisciplinary coordination',
  'main.footer.copyright': '© {year} AUDYA — All rights reserved',
  'main.footer.legal':     'Legal notice',
  'main.footer.rgpd':      'GDPR',
  'main.footer.cookies':   'Cookies',
  'main.footer.contact':   'Contact us',

  // ── Settings ───────────────────────────────────────────────────────────
  'settings.title':                 'MY SETTINGS',
  'settings.preferences':           'Preferences',
  'settings.language':              'Language',
  'settings.date':                  'Date',
  'settings.time':                  'Time',
  'settings.notifications':         'Notifications',
  'settings.notif.messages':        'Message notifications',
  'settings.notif.alerts':          'Alert notifications',
  'settings.notif.tasks':           'Task notifications',
  'settings.password':              'My password',
  'settings.password.new':          'New password',
  'settings.password.confirm':      'Confirm password',
  'settings.password.mismatch':     'Passwords do not match.',
  'settings.password.change':       'Change password',
  'settings.password.changing':     'Updating…',
  'settings.password.show':         'Show password',
  'settings.password.hide':         'Hide password',
  'settings.password.showConfirm':  'Show confirmation',
  'settings.password.hideConfirm':  'Hide confirmation',
  'settings.account':               'My account',
  'settings.account.delete':        'Delete my account',
  'settings.save':                  'Save changes',
  'settings.saving':                'Saving…',

  // ── Delete modal ───────────────────────────────────────────────────────
  'modal.delete.text':    'Are you sure you want to delete your account?',
  'modal.delete.cancel':  'Cancel',
  'modal.delete.confirm': 'Yes',

  // ── Errors ─────────────────────────────────────────────────────────────
  'error.load':     'Unable to load settings.',
  'error.save':     'Unable to save settings.',
  'error.password': 'Unable to change password.',
  'error.delete':   'Unable to delete account.',
};

const ES: TranslationMap = {
  // ── Menú principal ─────────────────────────────────────────────────────
  'menu.health':         'Mi salud',
  'menu.hearing':        'Mis audífonos',
  'menu.notebook':       'Mi diario auditivo',
  'menu.professionals':  'Mis profesionales',
  'menu.agenda':         'Mi agenda',
  'menu.message':        'Mis mensajes',
  'menu.questionnaire':  'Mis cuestionarios',
  'menu.news':           'Noticias',

  // ── Etiquetas de sección ───────────────────────────────────────────────
  'screen.home':              'Inicio',
  'screen.health':            'Mi salud',
  'screen.professionals':     'Mis profesionales',
  'screen.settings':          'Mis ajustes',
  'screen.profile':           'Mi perfil',
  'screen.messaging':         'Mis mensajes',
  'screen.agenda':            'Mi agenda',
  'screen.notebook':          'Mi diario auditivo',
  'screen.hearing':           'Mis audífonos',
  'screen.questionnaire':     'Mis cuestionarios',
  'screen.news':              'Noticias',
  'screen.menu':              'Menú',

  // ── NavBar ─────────────────────────────────────────────────────────────
  'navbar.notifications':   'Notificaciones',
  'navbar.settings':        'Ajustes',
  'navbar.profileMenu':     'Menú de perfil',
  'navbar.profile':         'Perfil',
  'navbar.preferences':     'Preferencias',
  'navbar.logout':          'Cerrar sesión',

  // ── BottomNav ──────────────────────────────────────────────────────────
  'bottomnav.home':      'Inicio',
  'bottomnav.openMenu':  'Abrir menú',
  'bottomnav.assistant': 'Asistente AUDYA',

  // ── Página principal ───────────────────────────────────────────────────
  'main.banner':           'Audya simplifica el seguimiento del paciente y refuerza la coordinación multidisciplinaria',
  'main.footer.copyright': '© {year} AUDYA — Todos los derechos reservados',
  'main.footer.legal':     'Aviso legal',
  'main.footer.rgpd':      'RGPD',
  'main.footer.cookies':   'Cookies',
  'main.footer.contact':   'Contáctenos',

  // ── Ajustes ────────────────────────────────────────────────────────────
  'settings.title':                 'MIS AJUSTES',
  'settings.preferences':           'Preferencias',
  'settings.language':              'Idioma',
  'settings.date':                  'Fecha',
  'settings.time':                  'Hora',
  'settings.notifications':         'Notificaciones',
  'settings.notif.messages':        'Notificaciones de mensajes',
  'settings.notif.alerts':          'Notificaciones de alertas',
  'settings.notif.tasks':           'Notificaciones de tareas',
  'settings.password':              'Mi contraseña',
  'settings.password.new':          'Nueva contraseña',
  'settings.password.confirm':      'Confirmar contraseña',
  'settings.password.mismatch':     'Las contraseñas no coinciden.',
  'settings.password.change':       'Cambiar contraseña',
  'settings.password.changing':     'Actualizando…',
  'settings.password.show':         'Mostrar contraseña',
  'settings.password.hide':         'Ocultar contraseña',
  'settings.password.showConfirm':  'Mostrar confirmación',
  'settings.password.hideConfirm':  'Ocultar confirmación',
  'settings.account':               'Mi cuenta',
  'settings.account.delete':        'Eliminar mi cuenta',
  'settings.save':                  'Guardar cambios',
  'settings.saving':                'Guardando…',

  // ── Modal eliminación ──────────────────────────────────────────────────
  'modal.delete.text':    '¿Realmente quiere eliminar su cuenta?',
  'modal.delete.cancel':  'Cancelar',
  'modal.delete.confirm': 'Sí',

  // ── Errores ────────────────────────────────────────────────────────────
  'error.load':     'Imposible cargar los ajustes.',
  'error.save':     'Imposible guardar los ajustes.',
  'error.password': 'Imposible cambiar la contraseña.',
  'error.delete':   'Imposible eliminar la cuenta.',
};

export const TRANSLATIONS: Record<Language, TranslationMap> = { FR, EN, ES };
