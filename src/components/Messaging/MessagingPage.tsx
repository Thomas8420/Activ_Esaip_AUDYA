import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles, COLORS } from '../../screens/Messaging/MessagingScreen.styles';
import NavBar from '../common/NavBar/NavBar';
import BottomNav from '../common/BottomNav/BottomNav';
import BottomSheetModal from '../common/BottomSheetModal/BottomSheetModal';
import SelectModal from '../common/SelectModal/SelectModal';
import DocumentPicker, { types as DocumentTypes } from 'react-native-document-picker';
import {
  Conversation,
  Contact,
  PendingAttachment,
  fetchConversations,
  MOCK_CONVERSATIONS,
  MOCK_CONTACTS,
  USE_MESSAGING_API,
} from '../../services/messagingService';
import { useNavigation, SelectedConversation } from '../../context/NavigationContext';
import { useLanguage } from '../../context/LanguageContext';

/** Icône silhouette personne (état vide) */
const PersonIcon = () => (
  <Icon name="person-circle-outline" size={40} color={COLORS.textLighter} />
);

/** Calcule les initiales d'un nom complet (ex: "Arnaud DEVEZE" → "AD") */
function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('');
}

// ─── Validation pièce jointe (allow-list MIME + plafond taille) ─────────────
const NEW_MSG_MAX_ATTACHMENT_MB = 10;
const NEW_MSG_ALLOWED_MIME = /^(image\/(png|jpe?g|gif|webp|heic|heif)|application\/pdf|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document|text\/plain)$/i;

function validateNewMessageAttachment(type: string | undefined | null, sizeBytes?: number): string | null {
  if (!type || !NEW_MSG_ALLOWED_MIME.test(type)) {
    return 'Type de fichier non autorisé.';
  }
  if (sizeBytes !== undefined && sizeBytes > NEW_MSG_MAX_ATTACHMENT_MB * 1024 * 1024) {
    return `Fichier trop volumineux (${NEW_MSG_MAX_ATTACHMENT_MB} Mo max).`;
  }
  return null;
}

// ─── Sujets prédéfinis (niveau module) ───────────────────────────────────────

const SUBJECT_OPTIONS = [
  'Informations',
  'Consultations / RDV',
  'Problème d\'audition',
  'Problème d\'appareillage',
  'Retour d\'information positif',
  'Retour d\'information négatif',
  'Réclamation',
  'Autre',
] as const;

// ─── NewMessageModal ──────────────────────────────────────────────────────────

type NewMessageModalProps = {
  visible: boolean;
  contacts: Contact[];
  onClose: () => void;
  onCompose: (contact: Contact, subject: string, message: string, attachment: PendingAttachment | null) => void;
};

/**
 * NewMessageModal — Bottom-sheet "Nouveau message".
 * Sélection du correspondant, sujet prédéfini (SelectModal), pièce jointe optionnelle.
 */
const NewMessageModal = ({ visible, contacts, onClose, onCompose }: NewMessageModalProps) => {
  const [search, setSearch] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubjectPickerVisible, setIsSubjectPickerVisible] = useState(false);
  const [attachment, setAttachment] = useState<PendingAttachment | null>(null);

  useEffect(() => {
    if (visible) {
      setSearch('');
      setSelectedContact(null);
      setSubject('');
      setMessage('');
      setAttachment(null);
      setIsSubjectPickerVisible(false);
    }
  }, [visible]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? contacts.filter(c => c.name.toLowerCase().includes(q)) : contacts;
  }, [contacts, search]);

  const handlePickDocument = async () => {
    try {
      const results = await DocumentPicker.pick({
        type: [DocumentTypes.pdf, DocumentTypes.docx, DocumentTypes.plainText, DocumentTypes.images],
        allowMultiSelection: false,
      });
      const r = results[0];
      const reason = validateNewMessageAttachment(r.type, r.size ?? undefined);
      if (reason) {
        Alert.alert('Pièce jointe refusée', reason);
        return;
      }
      setAttachment({ uri: r.uri, name: r.name ?? 'fichier', type: r.type ?? 'application/octet-stream' });
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        Alert.alert('Erreur', 'Impossible de sélectionner le fichier.');
      }
    }
  };

  const canCompose = selectedContact !== null && subject.length > 0;

  return (
    <>
      <BottomSheetModal visible={visible} onClose={onClose}>
        <ScrollView
          style={modalStyles.sheet}
          bounces={false}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={modalStyles.handle} />

          <View style={modalStyles.header}>
            <Text style={modalStyles.headerTitle}>Nouveau message</Text>
            <TouchableOpacity
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Fermer"
            >
              <Icon name="close" size={22} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>

          {/* ── 1. Correspondant ── */}
          <Text style={modalStyles.stepLabel}>1. Correspondant</Text>
          <View style={modalStyles.searchRow}>
            <Icon name="search-outline" size={16} color={COLORS.textLighter} />
            <TextInput
              style={modalStyles.searchInput}
              placeholder="Rechercher…"
              placeholderTextColor={COLORS.textLighter}
              value={search}
              onChangeText={setSearch}
              autoCorrect={false}
              autoCapitalize="none"
            />
          </View>
          <View style={modalStyles.contactList}>
            {filtered.map(item => (
              <TouchableOpacity
                key={item.id}
                style={[
                  modalStyles.contactItem,
                  selectedContact?.id === item.id && modalStyles.contactItemSelected,
                ]}
                onPress={() => setSelectedContact(item)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={item.name}
              >
                <View style={modalStyles.contactAvatar}>
                  <Text style={modalStyles.contactAvatarText}>{initials(item.name)}</Text>
                </View>
                <Text style={[
                  modalStyles.contactName,
                  selectedContact?.id === item.id && modalStyles.contactNameSelected,
                ]}>
                  {item.name}
                </Text>
                {selectedContact?.id === item.id && (
                  <Icon name="checkmark" size={18} color={COLORS.orange} />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* ── 2. Sujet ── */}
          <Text style={modalStyles.stepLabel}>2. Sujet</Text>
          <TouchableOpacity
            style={modalStyles.subjectPill}
            onPress={() => setIsSubjectPickerVisible(true)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Choisir le sujet"
          >
            <Text style={[modalStyles.subjectPillText, !subject && modalStyles.subjectPillPlaceholder]} numberOfLines={1}>
              {subject || 'Choisir le sujet…'}
            </Text>
            <View style={modalStyles.chevronBubble}>
              <Icon name="chevron-down" size={14} color={COLORS.white} />
            </View>
          </TouchableOpacity>

          {/* ── 3. Message ── */}
          <Text style={modalStyles.stepLabel}>3. Message</Text>
          <TextInput
            style={modalStyles.messageInput}
            placeholder="Écrivez votre message…"
            placeholderTextColor={COLORS.textLighter}
            value={message}
            onChangeText={setMessage}
            multiline
            textAlignVertical="top"
            maxLength={2000}
          />

          {/* ── 4. Pièce jointe (optionnel) ── */}
          <Text style={modalStyles.stepLabel}>4. Pièce jointe (optionnel)</Text>
          {attachment ? (
            <View style={modalStyles.fileRow}>
              <Icon name="document-text-outline" size={18} color={COLORS.orange} />
              <Text style={modalStyles.fileSelectedText} numberOfLines={1}>{attachment.name}</Text>
              <TouchableOpacity
                onPress={() => setAttachment(null)}
                accessibilityRole="button"
                accessibilityLabel="Supprimer la pièce jointe"
              >
                <Icon name="close-circle-outline" size={18} color={COLORS.textLight} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={modalStyles.pickFileBtn}
              onPress={handlePickDocument}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Choisir un fichier"
            >
              <Icon name="document-attach-outline" size={20} color={COLORS.white} />
              <Text style={modalStyles.pickFileBtnText}>Choisir un fichier</Text>
            </TouchableOpacity>
          )}

          {/* ── Composer ── */}
          <TouchableOpacity
            style={[modalStyles.composeBtn, !canCompose && modalStyles.composeBtnDisabled]}
            onPress={() => { if (canCompose && selectedContact) { onCompose(selectedContact, subject, message.trim(), attachment); } }}
            disabled={!canCompose}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Composer le message"
          >
            <Text style={modalStyles.composeBtnText}>Composer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={modalStyles.cancelBtn}
            onPress={onClose}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Annuler"
          >
            <Text style={modalStyles.cancelBtnText}>Annuler</Text>
          </TouchableOpacity>
        </ScrollView>
      </BottomSheetModal>

      <SelectModal
        visible={isSubjectPickerVisible}
        onClose={() => setIsSubjectPickerVisible(false)}
        title="Sujet du message"
        options={SUBJECT_OPTIONS}
        value={subject}
        onSelect={s => setSubject(s)}
      />
    </>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Page Ma Messagerie — liste des conversations.
 * Filtre EN LIGNE : n'affiche que les conversations dont le correspondant est connecté.
 */
const MessagingPage = () => {
  const { navigateToMessagingChat } = useNavigation();
  const { t } = useLanguage();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [isNewMessageVisible, setIsNewMessageVisible] = useState(false);

  // ── Load ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        if (USE_MESSAGING_API) {
          const data = await fetchConversations();
          setConversations(data.conversations);
          setContacts(data.contacts);
        } else {
          setConversations(MOCK_CONVERSATIONS);
          setContacts(MOCK_CONTACTS);
        }
      } catch {
        Alert.alert('Erreur', 'Impossible de charger les conversations.');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // ── Filtre EN LIGNE ──────────────────────────────────────────────────────────
  const displayed = useMemo(() => {
    const ids = new Set(contacts.filter(c => c.status === 'online').map(c => c.id));
    return onlineOnly
      ? conversations.filter(c => ids.has(c.correspondentId))
      : conversations;
  }, [contacts, conversations, onlineOnly]);

  // ── Nouveau message ──────────────────────────────────────────────────────────
  const handleCompose = useCallback((contact: Contact, subject: string, message: string, attachment: PendingAttachment | null) => {
    setIsNewMessageVisible(false);
    navigateToMessagingChat({
      id: null,
      subject,
      correspondentId: contact.id,
      correspondentName: contact.name,
      correspondentPhone: '',
      correspondentEmail: '',
      correspondentCity: '',
      correspondentZip: '',
      status: 'pending',
      isOnline: contact.status === 'online',
      initialMessage: message || undefined,
      initialAttachment: attachment ?? undefined,
    });
  }, [navigateToMessagingChat]);

  // ── Navigation vers le chat ──────────────────────────────────────────────────
  const openConversation = useCallback((conv: Conversation) => {
    const contact = contacts.find(c => c.id === conv.correspondentId);
    const selected: SelectedConversation = {
      id: conv.id,
      subject: conv.subject,
      correspondentId: conv.correspondentId,
      correspondentName: conv.correspondentName,
      correspondentPhone: '',
      correspondentEmail: '',
      correspondentCity: '',
      correspondentZip: '',
      status: conv.status,
      isOnline: contact?.status === 'online',
    };
    navigateToMessagingChat(selected);
  }, [contacts, navigateToMessagingChat]);

  // ── Render content ──────────────────────────────────────────────────────────
  const renderContent = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color={COLORS.orange} style={{ marginTop: 40 }} />;
    }
    if (displayed.length === 0) {
      return (
        <View style={styles.emptyState} testID="emptyState">
          <View style={styles.emptyCircle}>
            <PersonIcon />
          </View>
        </View>
      );
    }
    return (
      <FlatList
        data={displayed}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        style={styles.listContainer}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        testID="conversationList"
      />
    );
  };

  // ── Render row ───────────────────────────────────────────────────────────────
  const renderItem = useCallback(({ item }: { item: Conversation }) => {
    const contact = contacts.find(c => c.id === item.correspondentId);
    const isOnline = contact?.status === 'online';
    return (
      <TouchableOpacity
        style={styles.convRow}
        onPress={() => openConversation(item)}
        activeOpacity={0.7}
        testID={`conv-${item.id}`}
        accessibilityRole="button"
        accessibilityLabel={`Conversation avec ${item.correspondentName}`}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials(item.correspondentName)}</Text>
          {isOnline && <View style={localStyles.onlineIndicator} />}
        </View>
        <View style={styles.convContent}>
          <Text style={styles.convName}>{item.correspondentName}</Text>
          <Text style={styles.convSubject} numberOfLines={1}>{item.subject}</Text>
          <Text style={styles.convPreview} numberOfLines={1}>{item.lastMessage}</Text>
        </View>
        {item.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>{item.unreadCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }, [contacts, openConversation]);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <NavBar />

      {/* Titre */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>{t('screen.messaging')}</Text>
        <TouchableOpacity
          style={styles.titleComposeBtn}
          onPress={() => setIsNewMessageVisible(true)}
          accessibilityRole="button"
          accessibilityLabel="Nouveau message"
        >
          <Icon name="create-outline" size={22} color={COLORS.orange} />
        </TouchableOpacity>
      </View>

      {/* Filtre */}
      <View style={styles.filterRow}>
        <Text style={styles.filterLabel}>Vos correspondants</Text>
        <TouchableOpacity
          style={[styles.filterBadge, onlineOnly && styles.filterBadgeActive]}
          onPress={() => setOnlineOnly(v => !v)}
          activeOpacity={0.7}
          testID="filterOnline"
        >
          <Text style={[styles.filterBadgeText, onlineOnly && styles.filterBadgeTextActive]}>
            EN LIGNE
          </Text>
        </TouchableOpacity>
      </View>

      {renderContent()}

      <NewMessageModal
        visible={isNewMessageVisible}
        contacts={contacts}
        onClose={() => setIsNewMessageVisible(false)}
        onCompose={handleCompose}
      />

      <BottomNav />
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
});

const modalStyles = StyleSheet.create({
  // ── Conteneur ──────────────────────────────────────────────────────────────
  sheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 36,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: COLORS.text,
  },

  // ── Steps ──────────────────────────────────────────────────────────────────
  stepLabel: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 12,
    color: COLORS.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 16,
  },

  // ── Recherche correspondant ────────────────────────────────────────────────
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 22,
    paddingHorizontal: 12,
    height: 40,
    marginBottom: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: COLORS.text,
  },
  contactList: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    marginBottom: 4,
    maxHeight: 180,
    overflow: 'hidden',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    gap: 12,
  },
  contactItemSelected: {
    backgroundColor: '#FFF5F0',
  },
  contactAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactAvatarText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 13,
    color: COLORS.white,
  },
  contactName: {
    flex: 1,
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: COLORS.text,
  },
  contactNameSelected: {
    fontFamily: 'Montserrat-SemiBold',
    color: COLORS.orange,
  },

  // ── Sujet ──────────────────────────────────────────────────────────────────
  subjectPill: {
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subjectPillText: {
    flex: 1,
    fontFamily: 'Montserrat-Regular',
    fontSize: 15,
    color: '#5E6E8A',
  },
  subjectPillPlaceholder: {
    color: COLORS.textLighter,
  },
  chevronBubble: {
    width: 28,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#D3D3D3',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Message ────────────────────────────────────────────────────────────────
  messageInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: COLORS.text,
    minHeight: 100,
    maxHeight: 160,
  },

  // ── Pièce jointe ──────────────────────────────────────────────────────────
  pickFileBtn: {
    backgroundColor: COLORS.orange,
    borderRadius: 22,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  pickFileBtnText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 15,
    color: COLORS.white,
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 22,
    height: 48,
    paddingHorizontal: 14,
    backgroundColor: COLORS.white,
    gap: 10,
  },
  fileSelectedText: {
    flex: 1,
    fontFamily: 'Montserrat-Regular',
    fontSize: 13,
    color: COLORS.text,
  },

  // ── Boutons d'action ───────────────────────────────────────────────────────
  composeBtn: {
    backgroundColor: COLORS.orange,
    borderRadius: 22,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  composeBtnDisabled: {
    backgroundColor: '#D3D3D3',
  },
  composeBtnText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 15,
    color: COLORS.white,
  },
  cancelBtn: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 15,
    color: COLORS.textLight,
  },
});

export default MessagingPage;
