import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
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

/** Icône silhouette personne (état vide) */
const PersonIcon = () => (
  <Svg width={40} height={40} viewBox="0 0 24 24">
    <Path
      d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"
      fill={COLORS.textLighter}
    />
  </Svg>
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
      } catch (err) {
        console.error('Erreur chargement conversations:', err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // ── Filtre EN LIGNE ──────────────────────────────────────────────────────────
  const onlineContactIds = new Set(
    contacts.filter(c => c.status === 'online').map(c => c.id),
  );
  const displayed = onlineOnly
    ? conversations.filter(c => onlineContactIds.has(c.correspondentId))
    : conversations;

  // ── Navigation vers le chat ──────────────────────────────────────────────────
  const openConversation = (conv: Conversation) => {
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
  };

  // ── Render row ───────────────────────────────────────────────────────────────
  const renderItem = ({ item }: { item: Conversation }) => {
    const contact = contacts.find(c => c.id === item.correspondentId);
    const isOnline = contact?.status === 'online';
    return (
      <TouchableOpacity
        style={styles.convRow}
        onPress={() => openConversation(item)}
        activeOpacity={0.7}
        testID={`conv-${item.id}`}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials(item.correspondentName)}</Text>
          {isOnline && (
            <View style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: '#4CAF50',
              borderWidth: 2,
              borderColor: COLORS.white,
            }} />
          )}
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
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <NavBar />

      {/* Titre */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>MA MESSAGERIE</Text>
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

      {isLoading ? (
        <ActivityIndicator size="large" color={COLORS.orange} style={{ marginTop: 40 }} />
      ) : displayed.length === 0 ? (
        <View style={styles.emptyState} testID="emptyState">
          <View style={styles.emptyCircle}>
            <PersonIcon />
          </View>
        </View>
      ) : (
        <FlatList
          data={displayed}
          keyExtractor={item => String(item.id)}
          renderItem={renderItem}
          style={styles.listContainer}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          testID="conversationList"
        />
      )}

      <BottomNav />
    </SafeAreaView>
  );
};

export default MessagingPage;
