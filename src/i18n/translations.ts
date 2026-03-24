// src/i18n/translations.ts
// Toutes les chaînes traduisibles de l'application.
// Pour ajouter une langue : dupliquer un bloc et renseigner toutes les clés.
// Pour ajouter une clé : l'ajouter dans les 3 langues.

export type Language = 'FR' | 'EN' | 'ES' | 'TH' | 'AR' | 'HY' | 'RU' | 'TR';

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

  // ── Titres sections pages ──────────────────────────────────────────────
  'health.section.general':        'Informations générales',
  'questionnaire.section.new':     'Nouveau questionnaire',
  'questionnaire.section.history': 'Historique ({count})',
  'device.ear.right':              'Oreille droite',
  'device.ear.left':               'Oreille gauche',

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

  // ── Page section titles ────────────────────────────────────────────────
  'health.section.general':        'General information',
  'questionnaire.section.new':     'New questionnaire',
  'questionnaire.section.history': 'History ({count})',
  'device.ear.right':              'Right ear',
  'device.ear.left':               'Left ear',

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

  // ── Títulos secciones ──────────────────────────────────────────────────
  'health.section.general':        'Información general',
  'questionnaire.section.new':     'Nuevo cuestionario',
  'questionnaire.section.history': 'Historial ({count})',
  'device.ear.right':              'Oído derecho',
  'device.ear.left':               'Oído izquierdo',

  // ── Errores ────────────────────────────────────────────────────────────
  'error.load':     'Imposible cargar los ajustes.',
  'error.save':     'Imposible guardar los ajustes.',
  'error.password': 'Imposible cambiar la contraseña.',
  'error.delete':   'Imposible eliminar la cuenta.',
};

const TH: TranslationMap = {
  // ── เมนูหลัก ────────────────────────────────────────────────────────────
  'menu.health':         'สุขภาพของฉัน',
  'menu.hearing':        'อุปกรณ์ช่วยฟังของฉัน',
  'menu.notebook':       'สมุดบันทึกการได้ยิน',
  'menu.professionals':  'ผู้เชี่ยวชาญของฉัน',
  'menu.agenda':         'ตารางนัดหมายของฉัน',
  'menu.message':        'ข้อความของฉัน',
  'menu.questionnaire':  'แบบสอบถามของฉัน',
  'menu.news':           'ข่าวสาร',

  // ── ป้ายกำกับหน้าจอ ───────────────────────────────────────────────────────
  'screen.home':              'หน้าหลัก',
  'screen.health':            'สุขภาพของฉัน',
  'screen.professionals':     'ผู้เชี่ยวชาญของฉัน',
  'screen.settings':          'การตั้งค่าของฉัน',
  'screen.profile':           'โปรไฟล์ของฉัน',
  'screen.messaging':         'ข้อความของฉัน',
  'screen.agenda':            'ตารางนัดหมายของฉัน',
  'screen.notebook':          'สมุดบันทึกการได้ยิน',
  'screen.hearing':           'อุปกรณ์ช่วยฟังของฉัน',
  'screen.questionnaire':     'แบบสอบถามของฉัน',
  'screen.news':              'ข่าวสาร',
  'screen.menu':              'เมนู',

  // ── NavBar ─────────────────────────────────────────────────────────────
  'navbar.notifications':   'การแจ้งเตือน',
  'navbar.settings':        'การตั้งค่า',
  'navbar.profileMenu':     'เมนูโปรไฟล์',
  'navbar.profile':         'โปรไฟล์',
  'navbar.preferences':     'ความชอบ',
  'navbar.logout':          'ออกจากระบบ',

  // ── BottomNav ──────────────────────────────────────────────────────────
  'bottomnav.home':      'หน้าหลัก',
  'bottomnav.openMenu':  'เปิดเมนู',
  'bottomnav.assistant': 'ผู้ช่วย AUDYA',

  // ── หน้าหลัก ───────────────────────────────────────────────────────────
  'main.banner':           'Audya ช่วยให้การติดตามผู้ป่วยง่ายขึ้นและเสริมสร้างการประสานงานแบบสหสาขาวิชาชีพ',
  'main.footer.copyright': '© {year} AUDYA — สงวนลิขสิทธิ์ทั้งหมด',
  'main.footer.legal':     'ข้อกำหนดทางกฎหมาย',
  'main.footer.rgpd':      'RGPD',
  'main.footer.cookies':   'คุกกี้',
  'main.footer.contact':   'ติดต่อเรา',

  // ── การตั้งค่า ─────────────────────────────────────────────────────────
  'settings.title':                 'การตั้งค่าของฉัน',
  'settings.preferences':           'ความชอบ',
  'settings.language':              'ภาษา',
  'settings.date':                  'วันที่',
  'settings.time':                  'เวลา',
  'settings.notifications':         'การแจ้งเตือน',
  'settings.notif.messages':        'การแจ้งเตือนข้อความ',
  'settings.notif.alerts':          'การแจ้งเตือนการเตือนภัย',
  'settings.notif.tasks':           'การแจ้งเตือนงาน',
  'settings.password':              'รหัสผ่านของฉัน',
  'settings.password.new':          'รหัสผ่านใหม่',
  'settings.password.confirm':      'ยืนยันรหัสผ่าน',
  'settings.password.mismatch':     'รหัสผ่านไม่ตรงกัน',
  'settings.password.change':       'เปลี่ยนรหัสผ่าน',
  'settings.password.changing':     'กำลังอัปเดต…',
  'settings.password.show':         'แสดงรหัสผ่าน',
  'settings.password.hide':         'ซ่อนรหัสผ่าน',
  'settings.password.showConfirm':  'แสดงการยืนยัน',
  'settings.password.hideConfirm':  'ซ่อนการยืนยัน',
  'settings.account':               'บัญชีของฉัน',
  'settings.account.delete':        'ลบบัญชีของฉัน',
  'settings.save':                  'บันทึกการเปลี่ยนแปลง',
  'settings.saving':                'กำลังบันทึก…',

  // ── Modal ──────────────────────────────────────────────────────────────
  'modal.delete.text':    'คุณแน่ใจหรือไม่ว่าต้องการลบบัญชีของคุณ?',
  'modal.delete.cancel':  'ยกเลิก',
  'modal.delete.confirm': 'ใช่',

  // ── ชื่อหัวข้อส่วน ─────────────────────────────────────────────────────
  'health.section.general':        'ข้อมูลทั่วไป',
  'questionnaire.section.new':     'แบบสอบถามใหม่',
  'questionnaire.section.history': 'ประวัติ ({count})',
  'device.ear.right':              'หูข้างขวา',
  'device.ear.left':               'หูข้างซ้าย',

  // ── ข้อผิดพลาด ─────────────────────────────────────────────────────────
  'error.load':     'ไม่สามารถโหลดการตั้งค่าได้',
  'error.save':     'ไม่สามารถบันทึกการตั้งค่าได้',
  'error.password': 'ไม่สามารถเปลี่ยนรหัสผ่านได้',
  'error.delete':   'ไม่สามารถลบบัญชีได้',
};

const AR: TranslationMap = {
  // ── القائمة الرئيسية ────────────────────────────────────────────────────
  'menu.health':         'صحتي',
  'menu.hearing':        'أجهزة السمع',
  'menu.notebook':       'دفتر السمع',
  'menu.professionals':  'متخصصوي',
  'menu.agenda':         'جدول أعمالي',
  'menu.message':        'رسائلي',
  'menu.questionnaire':  'استبياناتي',
  'menu.news':           'الأخبار',

  // ── تسميات الشاشة ──────────────────────────────────────────────────────
  'screen.home':              'الرئيسية',
  'screen.health':            'صحتي',
  'screen.professionals':     'متخصصوي',
  'screen.settings':          'إعداداتي',
  'screen.profile':           'ملفي الشخصي',
  'screen.messaging':         'رسائلي',
  'screen.agenda':            'جدول أعمالي',
  'screen.notebook':          'دفتر السمع',
  'screen.hearing':           'أجهزة السمع',
  'screen.questionnaire':     'استبياناتي',
  'screen.news':              'الأخبار',
  'screen.menu':              'القائمة',

  // ── NavBar ─────────────────────────────────────────────────────────────
  'navbar.notifications':   'الإشعارات',
  'navbar.settings':        'الإعدادات',
  'navbar.profileMenu':     'قائمة الملف الشخصي',
  'navbar.profile':         'الملف الشخصي',
  'navbar.preferences':     'التفضيلات',
  'navbar.logout':          'تسجيل الخروج',

  // ── BottomNav ──────────────────────────────────────────────────────────
  'bottomnav.home':      'الرئيسية',
  'bottomnav.openMenu':  'فتح القائمة',
  'bottomnav.assistant': 'مساعد AUDYA',

  // ── الصفحة الرئيسية ────────────────────────────────────────────────────
  'main.banner':           'تبسّط Audya متابعة المرضى وتعزّز التنسيق متعدد التخصصات',
  'main.footer.copyright': '© {year} AUDYA — جميع الحقوق محفوظة',
  'main.footer.legal':     'الشروط القانونية',
  'main.footer.rgpd':      'RGPD',
  'main.footer.cookies':   'ملفات تعريف الارتباط',
  'main.footer.contact':   'اتصل بنا',

  // ── الإعدادات ──────────────────────────────────────────────────────────
  'settings.title':                 'إعداداتي',
  'settings.preferences':           'التفضيلات',
  'settings.language':              'اللغة',
  'settings.date':                  'التاريخ',
  'settings.time':                  'الوقت',
  'settings.notifications':         'الإشعارات',
  'settings.notif.messages':        'إشعارات الرسائل',
  'settings.notif.alerts':          'إشعارات التنبيهات',
  'settings.notif.tasks':           'إشعارات المهام',
  'settings.password':              'كلمة مروري',
  'settings.password.new':          'كلمة مرور جديدة',
  'settings.password.confirm':      'تأكيد كلمة المرور',
  'settings.password.mismatch':     'كلمتا المرور غير متطابقتين.',
  'settings.password.change':       'تغيير كلمة المرور',
  'settings.password.changing':     'جارٍ التحديث…',
  'settings.password.show':         'إظهار كلمة المرور',
  'settings.password.hide':         'إخفاء كلمة المرور',
  'settings.password.showConfirm':  'إظهار التأكيد',
  'settings.password.hideConfirm':  'إخفاء التأكيد',
  'settings.account':               'حسابي',
  'settings.account.delete':        'حذف حسابي',
  'settings.save':                  'حفظ التغييرات',
  'settings.saving':                'جارٍ الحفظ…',

  // ── نافذة الحذف ────────────────────────────────────────────────────────
  'modal.delete.text':    'هل تريد حقاً حذف حسابك؟',
  'modal.delete.cancel':  'إلغاء',
  'modal.delete.confirm': 'نعم',

  // ── عناوين الأقسام ─────────────────────────────────────────────────────
  'health.section.general':        'معلومات عامة',
  'questionnaire.section.new':     'استبيان جديد',
  'questionnaire.section.history': 'السجل ({count})',
  'device.ear.right':              'الأذن اليمنى',
  'device.ear.left':               'الأذن اليسرى',

  // ── الأخطاء ────────────────────────────────────────────────────────────
  'error.load':     'تعذّر تحميل الإعدادات.',
  'error.save':     'تعذّر حفظ الإعدادات.',
  'error.password': 'تعذّر تغيير كلمة المرور.',
  'error.delete':   'تعذّر حذف الحساب.',
};

const HY: TranslationMap = {
  // ── Հիմնական ընտրացանկ ─────────────────────────────────────────────────
  'menu.health':         'Իմ առողջությունը',
  'menu.hearing':        'Իմ լսողական սարքերը',
  'menu.notebook':       'Իմ լսողական օրագիրը',
  'menu.professionals':  'Իմ մասնագետները',
  'menu.agenda':         'Իմ ժամանակացույցը',
  'menu.message':        'Իմ հաղորդագրությունները',
  'menu.questionnaire':  'Իմ հարցաթերթերը',
  'menu.news':           'Նորություններ',

  // ── Էկրանի պիտակներ ────────────────────────────────────────────────────
  'screen.home':              'Գլխավոր',
  'screen.health':            'Իմ առողջությունը',
  'screen.professionals':     'Իմ մասնագետները',
  'screen.settings':          'Իմ կարգավորումները',
  'screen.profile':           'Իմ պրոֆիլը',
  'screen.messaging':         'Իմ հաղորդագրությունները',
  'screen.agenda':            'Իմ ժամանակացույցը',
  'screen.notebook':          'Իմ լսողական օրագիրը',
  'screen.hearing':           'Իմ լսողական սարքերը',
  'screen.questionnaire':     'Իմ հարցաթերթերը',
  'screen.news':              'Նորություններ',
  'screen.menu':              'Ընտրացանկ',

  // ── NavBar ─────────────────────────────────────────────────────────────
  'navbar.notifications':   'Ծանուցումներ',
  'navbar.settings':        'Կարգավորումներ',
  'navbar.profileMenu':     'Պրոֆիլի ընտրացանկ',
  'navbar.profile':         'Պրոֆիլ',
  'navbar.preferences':     'Նախապատվություններ',
  'navbar.logout':          'Ելք',

  // ── BottomNav ──────────────────────────────────────────────────────────
  'bottomnav.home':      'Գլխավոր',
  'bottomnav.openMenu':  'Բացել ընտրացանկը',
  'bottomnav.assistant': 'AUDYA օգնական',

  // ── Գլխավոր էջ ────────────────────────────────────────────────────────
  'main.banner':           'Audya-ն պարզեցնում է հիվանդի հետևումը եւ ամրապնդում բազմամասնագիտական համակարգումը',
  'main.footer.copyright': '© {year} AUDYA — Բոլոր իրավունքները պաշտպանված են',
  'main.footer.legal':     'Իրավական ծանուցում',
  'main.footer.rgpd':      'RGPD',
  'main.footer.cookies':   'Թխուկներ',
  'main.footer.contact':   'Կապ մեզ հետ',

  // ── Կարգավորումներ ─────────────────────────────────────────────────────
  'settings.title':                 'ԻՄ ԿԱՐԳԱՎՈՐՈՒՄՆԵՐԸ',
  'settings.preferences':           'Նախապատվություններ',
  'settings.language':              'Լեզու',
  'settings.date':                  'Ամսաթիվ',
  'settings.time':                  'Ժամ',
  'settings.notifications':         'Ծանուցումներ',
  'settings.notif.messages':        'Հաղորդագրությունների ծանուցումներ',
  'settings.notif.alerts':          'Ահազանգերի ծանուցումներ',
  'settings.notif.tasks':           'Առաջադրանքների ծանուցումներ',
  'settings.password':              'Իմ գաղտնաբառը',
  'settings.password.new':          'Նոր գաղտնաբառ',
  'settings.password.confirm':      'Հաստատել գաղտնաբառը',
  'settings.password.mismatch':     'Գաղտնաբառերը չեն համընկնում։',
  'settings.password.change':       'Փոխել գաղտնաբառը',
  'settings.password.changing':     'Թարմացվում է…',
  'settings.password.show':         'Ցույց տալ գաղտնաբառը',
  'settings.password.hide':         'Թաքցնել գաղտնաբառը',
  'settings.password.showConfirm':  'Ցույց տալ հաստատումը',
  'settings.password.hideConfirm':  'Թաքցնել հաստատումը',
  'settings.account':               'Իմ հաշիվը',
  'settings.account.delete':        'Ջնջել իմ հաշիվը',
  'settings.save':                  'Պահպանել փոփոխությունները',
  'settings.saving':                'Պահպանվում է…',

  // ── Հաշվի ջնջման modal ────────────────────────────────────────────────
  'modal.delete.text':    'Դուք իսկապե՞ս ուզում եք ջնջել ձեր հաշիվը։',
  'modal.delete.cancel':  'Չեղարկել',
  'modal.delete.confirm': 'Այո',

  // ── Բաժնի վերնագրեր ───────────────────────────────────────────────────
  'health.section.general':        'Ընդհանուր տեղեկություններ',
  'questionnaire.section.new':     'Նոր հարցաթերթ',
  'questionnaire.section.history': 'Պատմություն ({count})',
  'device.ear.right':              'Աջ ականջ',
  'device.ear.left':               'Ձախ ականջ',

  // ── Սխալներ ───────────────────────────────────────────────────────────
  'error.load':     'Հնարավոր չէ բեռնել կարգավորումները։',
  'error.save':     'Հնարավոր չէ պահպանել կարգավորումները։',
  'error.password': 'Հնարավոր չէ փոխել գաղտնաբառը։',
  'error.delete':   'Հնարավոր չէ ջնջել հաշիվը։',
};

const RU: TranslationMap = {
  // ── Главное меню ───────────────────────────────────────────────────────
  'menu.health':         'Моё здоровье',
  'menu.hearing':        'Мои слуховые аппараты',
  'menu.notebook':       'Мой слуховой дневник',
  'menu.professionals':  'Мои специалисты',
  'menu.agenda':         'Моё расписание',
  'menu.message':        'Мои сообщения',
  'menu.questionnaire':  'Мои анкеты',
  'menu.news':           'Новости',

  // ── Метки экрана ──────────────────────────────────────────────────────
  'screen.home':              'Главная',
  'screen.health':            'Моё здоровье',
  'screen.professionals':     'Мои специалисты',
  'screen.settings':          'Мои настройки',
  'screen.profile':           'Мой профиль',
  'screen.messaging':         'Мои сообщения',
  'screen.agenda':            'Моё расписание',
  'screen.notebook':          'Мой слуховой дневник',
  'screen.hearing':           'Мои слуховые аппараты',
  'screen.questionnaire':     'Мои анкеты',
  'screen.news':              'Новости',
  'screen.menu':              'Меню',

  // ── NavBar ─────────────────────────────────────────────────────────────
  'navbar.notifications':   'Уведомления',
  'navbar.settings':        'Настройки',
  'navbar.profileMenu':     'Меню профиля',
  'navbar.profile':         'Профиль',
  'navbar.preferences':     'Предпочтения',
  'navbar.logout':          'Выйти',

  // ── BottomNav ──────────────────────────────────────────────────────────
  'bottomnav.home':      'Главная',
  'bottomnav.openMenu':  'Открыть меню',
  'bottomnav.assistant': 'Ассистент AUDYA',

  // ── Главная страница ───────────────────────────────────────────────────
  'main.banner':           'Audya упрощает наблюдение за пациентами и укрепляет многопрофильную координацию',
  'main.footer.copyright': '© {year} AUDYA — Все права защищены',
  'main.footer.legal':     'Правовая информация',
  'main.footer.rgpd':      'GDPR',
  'main.footer.cookies':   'Файлы cookie',
  'main.footer.contact':   'Связаться с нами',

  // ── Настройки ─────────────────────────────────────────────────────────
  'settings.title':                 'МОИ НАСТРОЙКИ',
  'settings.preferences':           'Предпочтения',
  'settings.language':              'Язык',
  'settings.date':                  'Дата',
  'settings.time':                  'Время',
  'settings.notifications':         'Уведомления',
  'settings.notif.messages':        'Уведомления о сообщениях',
  'settings.notif.alerts':          'Уведомления об оповещениях',
  'settings.notif.tasks':           'Уведомления о задачах',
  'settings.password':              'Мой пароль',
  'settings.password.new':          'Новый пароль',
  'settings.password.confirm':      'Подтвердить пароль',
  'settings.password.mismatch':     'Пароли не совпадают.',
  'settings.password.change':       'Изменить пароль',
  'settings.password.changing':     'Обновление…',
  'settings.password.show':         'Показать пароль',
  'settings.password.hide':         'Скрыть пароль',
  'settings.password.showConfirm':  'Показать подтверждение',
  'settings.password.hideConfirm':  'Скрыть подтверждение',
  'settings.account':               'Мой аккаунт',
  'settings.account.delete':        'Удалить мой аккаунт',
  'settings.save':                  'Сохранить изменения',
  'settings.saving':                'Сохранение…',

  // ── Модальное окно удаления ────────────────────────────────────────────
  'modal.delete.text':    'Вы действительно хотите удалить свой аккаунт?',
  'modal.delete.cancel':  'Отмена',
  'modal.delete.confirm': 'Да',

  // ── Заголовки разделов ────────────────────────────────────────────────
  'health.section.general':        'Общая информация',
  'questionnaire.section.new':     'Новая анкета',
  'questionnaire.section.history': 'История ({count})',
  'device.ear.right':              'Правое ухо',
  'device.ear.left':               'Левое ухо',

  // ── Ошибки ────────────────────────────────────────────────────────────
  'error.load':     'Не удалось загрузить настройки.',
  'error.save':     'Не удалось сохранить настройки.',
  'error.password': 'Не удалось изменить пароль.',
  'error.delete':   'Не удалось удалить аккаунт.',
};

const TR: TranslationMap = {
  // ── Ana menü ───────────────────────────────────────────────────────────
  'menu.health':         'Sağlığım',
  'menu.hearing':        'İşitme cihazlarım',
  'menu.notebook':       'İşitme günlüğüm',
  'menu.professionals':  'Uzmanlarım',
  'menu.agenda':         'Ajandам',
  'menu.message':        'Mesajlarım',
  'menu.questionnaire':  'Anketlerim',
  'menu.news':           'Haberler',

  // ── Ekran etiketleri ──────────────────────────────────────────────────
  'screen.home':              'Ana sayfa',
  'screen.health':            'Sağlığım',
  'screen.professionals':     'Uzmanlarım',
  'screen.settings':          'Ayarlarım',
  'screen.profile':           'Profilim',
  'screen.messaging':         'Mesajlarım',
  'screen.agenda':            'Ajandам',
  'screen.notebook':          'İşitme günlüğüm',
  'screen.hearing':           'İşitme cihazlarım',
  'screen.questionnaire':     'Anketlerim',
  'screen.news':              'Haberler',
  'screen.menu':              'Menü',

  // ── NavBar ─────────────────────────────────────────────────────────────
  'navbar.notifications':   'Bildirimler',
  'navbar.settings':        'Ayarlar',
  'navbar.profileMenu':     'Profil menüsü',
  'navbar.profile':         'Profil',
  'navbar.preferences':     'Tercihler',
  'navbar.logout':          'Çıkış yap',

  // ── BottomNav ──────────────────────────────────────────────────────────
  'bottomnav.home':      'Ana sayfa',
  'bottomnav.openMenu':  'Menüyü aç',
  'bottomnav.assistant': 'AUDYA Asistanı',

  // ── Ana sayfa ─────────────────────────────────────────────────────────
  'main.banner':           'Audya hasta takibini kolaylaştırır ve multidisipliner koordinasyonu güçlendirir',
  'main.footer.copyright': '© {year} AUDYA — Tüm hakları saklıdır',
  'main.footer.legal':     'Yasal bildirim',
  'main.footer.rgpd':      'KVKK',
  'main.footer.cookies':   'Çerezler',
  'main.footer.contact':   'Bize ulaşın',

  // ── Ayarlar ────────────────────────────────────────────────────────────
  'settings.title':                 'AYARLARIM',
  'settings.preferences':           'Tercihler',
  'settings.language':              'Dil',
  'settings.date':                  'Tarih',
  'settings.time':                  'Saat',
  'settings.notifications':         'Bildirimler',
  'settings.notif.messages':        'Mesaj bildirimleri',
  'settings.notif.alerts':          'Uyarı bildirimleri',
  'settings.notif.tasks':           'Görev bildirimleri',
  'settings.password':              'Şifrem',
  'settings.password.new':          'Yeni şifre',
  'settings.password.confirm':      'Şifreyi onayla',
  'settings.password.mismatch':     'Şifreler eşleşmiyor.',
  'settings.password.change':       'Şifreyi değiştir',
  'settings.password.changing':     'Güncelleniyor…',
  'settings.password.show':         'Şifreyi göster',
  'settings.password.hide':         'Şifreyi gizle',
  'settings.password.showConfirm':  'Onayı göster',
  'settings.password.hideConfirm':  'Onayı gizle',
  'settings.account':               'Hesabım',
  'settings.account.delete':        'Hesabımı sil',
  'settings.save':                  'Değişiklikleri kaydet',
  'settings.saving':                'Kaydediliyor…',

  // ── Hesap silme modalı ─────────────────────────────────────────────────
  'modal.delete.text':    'Hesabınızı gerçekten silmek istiyor musunuz?',
  'modal.delete.cancel':  'İptal',
  'modal.delete.confirm': 'Evet',

  // ── Bölüm başlıkları ──────────────────────────────────────────────────
  'health.section.general':        'Genel bilgiler',
  'questionnaire.section.new':     'Yeni anket',
  'questionnaire.section.history': 'Geçmiş ({count})',
  'device.ear.right':              'Sağ kulak',
  'device.ear.left':               'Sol kulak',

  // ── Hatalar ────────────────────────────────────────────────────────────
  'error.load':     'Ayarlar yüklenemedi.',
  'error.save':     'Ayarlar kaydedilemedi.',
  'error.password': 'Şifre değiştirilemedi.',
  'error.delete':   'Hesap silinemedi.',
};

export const TRANSLATIONS: Record<Language, TranslationMap> = { FR, EN, ES, TH, AR, HY, RU, TR };
