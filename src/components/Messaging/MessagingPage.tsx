import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles, COLORS } from '../../screens/Messaging/MessagingScreen.styles';
import NavBar from '../common/NavBar/NavBar';
import BottomNav from '../common/BottomNav/BottomNav';
import {
  Conversation,
  Contact,
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
  const { onlineContactIds, displayed } = useMemo(() => {
    const ids = new Set(contacts.filter(c => c.status === 'online').map(c => c.id));
    const list = onlineOnly
      ? conversations.filter(c => ids.has(c.correspondentId))
      : conversations;
    return { onlineContactIds: ids, displayed: list };
  }, [contacts, conversations, onlineOnly]);

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

export default MessagingPage;
