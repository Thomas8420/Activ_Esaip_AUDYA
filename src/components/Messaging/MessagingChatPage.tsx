import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import DocumentPicker, { types as DocumentTypes } from 'react-native-document-picker';
import { styles, COLORS } from '../../screens/Messaging/MessagingChatScreen.styles';
import NavBar from '../common/NavBar/NavBar';
import BottomNav from '../common/BottomNav/BottomNav';
import {
  Message,
  PendingAttachment,
  fetchMessages,
  sendMessage,
  uploadAttachment,
  MOCK_MESSAGES,
  USE_MESSAGING_API,
} from '../../services/messagingService';
import { useNavigation, SelectedConversation } from '../../context/NavigationContext';
import { BASE_URL } from '../../services/api';

const POLL_INTERVAL_MS = 10_000;

// ─── Icônes ───────────────────────────────────────────────────────────────────

const ClipIcon = () => (
  <Icon name="attach" size={22} color={COLORS.textLight} />
);

const SendIcon = () => (
  <Icon name="send" size={20} color={COLORS.white} />
);

const DocIcon = () => (
  <Icon name="document-outline" size={16} color={COLORS.white} />
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('');
}

function isImageFile(name: string): boolean {
  return /\.(png|jpg|jpeg|gif|webp)$/i.test(name);
}

function isAdmin(userName: string): boolean {
  return /admin/i.test(userName);
}

/** Détermine la couleur de la bulle selon le rôle */
function bubbleStyle(msg: Message) {
  if (msg.isMe) {
    return styles.messageBubbleMe;
  }
  if (isAdmin(msg.userName)) {
    return styles.messageBubbleAdmin;
  }
  return styles.messageBubblePro;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface MessagingChatPageProps {
  conversation: SelectedConversation;
}

/**
 * Page de conversation individuelle.
 * - Polling toutes les 10 s pour les nouveaux messages
 * - Envoi de texte et de pièces jointes (images + documents)
 * - Couleurs : vert = moi, bleu = admin, teal = professionnel
 */
const MessagingChatPage: React.FC<MessagingChatPageProps> = ({ conversation }) => {
  const { goBack } = useNavigation();

  // ── State ────────────────────────────────────────────────────────────────────
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [inputText, setInputText] = useState('');
  const [pendingAttachments, setPendingAttachments] = useState<PendingAttachment[]>([]);

  /** ID de conversation (peut être null si nouvelle conversation) */
  const conversationIdRef = useRef<number | null>(conversation.id);
  /** ID du dernier message reçu, pour le polling incrémental */
  const lastMessageIdRef = useRef<number | null>(null);
  const flatListRef = useRef<FlatList<Message>>(null);

  // ── Chargement initial ───────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        if (USE_MESSAGING_API && conversationIdRef.current != null) {
          const msgs = await fetchMessages(conversationIdRef.current);
          setMessages(msgs);
          if (msgs.length > 0) {
            lastMessageIdRef.current = msgs[msgs.length - 1].id;
          }
        } else {
          setMessages(MOCK_MESSAGES);
          if (MOCK_MESSAGES.length > 0) {
            lastMessageIdRef.current = MOCK_MESSAGES[MOCK_MESSAGES.length - 1].id;
          }
        }
      } catch {
        Alert.alert('Erreur', 'Impossible de charger les messages.');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // ── Polling toutes les 10 secondes ───────────────────────────────────────────
  useEffect(() => {
    if (!USE_MESSAGING_API) {
      return;
    }
    const interval = setInterval(async () => {
      const convId = conversationIdRef.current;
      if (convId == null) {
        return;
      }
      try {
        const lastId = lastMessageIdRef.current ?? undefined;
        const newMsgs = await fetchMessages(convId, lastId);
        if (newMsgs.length > 0) {
          lastMessageIdRef.current = newMsgs[newMsgs.length - 1].id;
          setMessages(prev => [...prev, ...newMsgs]);
        }
      } catch {
        // Polling failure is silent — will retry on next interval
      }
    }, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  // ── Scroll to bottom on new messages ────────────────────────────────────────
  const scrollToBottom = useCallback(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, []);

  // ── Sélectionner une image ───────────────────────────────────────────────────
  const pickImage = () => {
    launchImageLibrary(
      { mediaType: 'photo', quality: 0.8, selectionLimit: 5 },
      response => {
        if (response.didCancel || response.errorCode) {
          return;
        }
        const assets = response.assets ?? [];
        const newAttachments: PendingAttachment[] = assets.map(a => ({
          uri: a.uri ?? '',
          name: a.fileName ?? 'image.jpg',
          type: a.type ?? 'image/jpeg',
        }));
        setPendingAttachments(prev => [...prev, ...newAttachments]);
      },
    );
  };

  // ── Sélectionner un document ─────────────────────────────────────────────────
  const pickDocument = async () => {
    try {
      const results = await DocumentPicker.pick({
        type: [DocumentTypes.pdf, DocumentTypes.doc, DocumentTypes.docx, DocumentTypes.plainText, DocumentTypes.images],
        allowMultiSelection: true,
      });
      const newAttachments: PendingAttachment[] = results.map(r => ({
        uri: r.uri,
        name: r.name ?? 'document',
        type: r.type ?? 'application/octet-stream',
      }));
      setPendingAttachments(prev => [...prev, ...newAttachments]);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        Alert.alert('Erreur', 'Impossible de sélectionner le document.');
      }
    }
  };

  // ── Action sheet pièces jointes ──────────────────────────────────────────────
  const handleAttach = () => {
    Alert.alert(
      'Pièce jointe',
      'Choisir un type',
      [
        { text: 'Photo',    onPress: pickImage },
        { text: 'Document', onPress: pickDocument },
        { text: 'Annuler',  style: 'cancel' },
      ],
    );
  };

  // ── Supprimer une pièce jointe en attente ────────────────────────────────────
  const removeAttachment = (index: number) => {
    setPendingAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // ── Envoi du message ─────────────────────────────────────────────────────────
  const handleSend = async () => {
    const text = inputText.trim();
    if (!text && pendingAttachments.length === 0) {
      return;
    }
    setIsSending(true);
    try {
      if (USE_MESSAGING_API) {
        // Upload les pièces jointes d'abord
        const fileIds: number[] = [];
        for (const att of pendingAttachments) {
          const fileId = await uploadAttachment(att.uri, att.type, att.name);
          fileIds.push(fileId);
        }
        const result = await sendMessage({
          correspondentId: conversation.correspondentId,
          conversationId: conversationIdRef.current,
          subject: conversation.subject,
          message: text || ' ',
          fileIds,
        });
        // Mise à jour de l'ID de conversation si c'était une nouvelle conv
        if (conversationIdRef.current == null) {
          conversationIdRef.current = result.conversationId;
        }
        const newMsg = result.messages[result.messages.length - 1];
        if (newMsg) {
          lastMessageIdRef.current = newMsg.id;
          setMessages(prev => [...prev, ...result.messages]);
        }
      } else {
        // Mode mock : ajouter le message localement
        const mockMsg: Message = {
          id: Date.now(),
          isMe: true,
          userName: 'Moi',
          text: text || '📎 Pièce jointe',
          timeText: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          createdAt: new Date().toISOString(),
          files: pendingAttachments.map((a, i) => ({
            id: i + 1000,
            name: a.name,
            url: a.uri,
          })),
        };
        setMessages(prev => [...prev, mockMsg]);
      }
      setInputText('');
      setPendingAttachments([]);
    } catch {
      Alert.alert('Erreur', "L'envoi du message a échoué.");
    } finally {
      setIsSending(false);
    }
  };

  // ── Render d'un message ──────────────────────────────────────────────────────
  const renderMessage = useCallback(({ item }: { item: Message }) => {
    const isMe = item.isMe;
    return (
      <View
        style={[
          styles.messageBubbleWrapper,
          isMe ? styles.messageBubbleWrapperMe : styles.messageBubbleWrapperThem,
        ]}
        testID={`msg-${item.id}`}
      >
        {!isMe && (
          <Text style={[styles.messageSenderName, { color: isAdmin(item.userName) ? COLORS.msgAdmin : COLORS.msgPro }]}>
            {item.userName}
          </Text>
        )}
        <View style={[styles.messageBubble, bubbleStyle(item)]}>
          {!!item.text && (
            <Text style={styles.messageBubbleText}>{item.text}</Text>
          )}
          {/* Pièces jointes reçues */}
          {item.files.length > 0 && (
            <View style={styles.attachmentRow}>
              {item.files.map(file => (
                isImageFile(file.name) ? (
                  <Image
                    key={file.id}
                    source={{ uri: USE_MESSAGING_API ? `${BASE_URL}${file.url}` : file.url }}
                    style={styles.attachmentImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View key={file.id} style={styles.attachmentDoc}>
                    <DocIcon />
                    <Text style={styles.attachmentDocText} numberOfLines={1}>{file.name}</Text>
                  </View>
                )
              ))}
            </View>
          )}
          <Text style={styles.messageTime}>{item.timeText}</Text>
        </View>
      </View>
    );
  }, []);

  // ── Localisation ─────────────────────────────────────────────────────────────
  const hasLocation = conversation.correspondentZip || conversation.correspondentCity;
  const locationText = [conversation.correspondentZip, conversation.correspondentCity]
    .filter(Boolean)
    .join(' • ');

  const canSend = (inputText.trim().length > 0 || pendingAttachments.length > 0) && !isSending;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" />
      <NavBar />

      {/* Barre d'en-tête teal */}
      <View style={styles.chatHeader} testID="chatHeader">
        <View style={styles.chatHeaderLeft}>
          <View style={styles.headerAvatar}>
            <Text style={styles.headerAvatarText}>
              {initials(conversation.correspondentName)}
            </Text>
          </View>
          <View style={styles.proBadge}>
            <Text style={styles.proBadgeText}>PRO</Text>
          </View>
        </View>
        <View style={styles.chatHeaderCenter}>
          {!!conversation.correspondentPhone && (
            <Text style={styles.headerPhone}>{conversation.correspondentPhone}</Text>
          )}
          {!!conversation.correspondentEmail && (
            <Text style={styles.headerEmail} numberOfLines={1}>
              {conversation.correspondentEmail}
            </Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={goBack}
          accessibilityLabel="Fermer la conversation"
          testID="closeChat"
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Sous-en-tête : nom + localisation */}
      <View style={styles.subHeader}>
        <Text style={styles.subHeaderName}>{conversation.correspondentName}</Text>
        {hasLocation && (
          <Text style={styles.subHeaderLocation}>{locationText}</Text>
        )}
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Liste des messages */}
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color={COLORS.teal}
            style={{ marginTop: 40, flex: 1 }}
          />
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={item => String(item.id)}
            renderItem={renderMessage}
            style={styles.messagesList}
            contentContainerStyle={styles.messagesContent}
            onContentSizeChange={scrollToBottom}
            onLayout={scrollToBottom}
            showsVerticalScrollIndicator={false}
            testID="messagesList"
          />
        )}

        {/* Barre pièces jointes en attente */}
        {pendingAttachments.length > 0 && (
          <View style={styles.pendingStrip} testID="pendingStrip">
            {pendingAttachments.map((att, i) => (
              <View key={i} style={styles.pendingItem}>
                <Text style={styles.pendingItemText} numberOfLines={1}>{att.name}</Text>
                <TouchableOpacity onPress={() => removeAttachment(i)}>
                  <Text style={styles.pendingRemove}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Zone de saisie */}
        <View style={styles.inputArea}>
          <TouchableOpacity
            style={styles.attachButton}
            onPress={handleAttach}
            accessibilityLabel="Ajouter une pièce jointe"
            testID="attachButton"
          >
            <ClipIcon />
          </TouchableOpacity>

          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Saisir votre message…"
            placeholderTextColor={COLORS.textLighter}
            multiline
            returnKeyType="default"
            testID="messageInput"
          />

          <TouchableOpacity
            style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!canSend}
            accessibilityLabel="Envoyer"
            testID="sendButton"
          >
            <SendIcon />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <BottomNav />
    </SafeAreaView>
  );
};

export default MessagingChatPage;
