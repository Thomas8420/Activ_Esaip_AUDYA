import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, FONT_REGULAR, FONT_SEMIBOLD } from '../../screens/Home/HomeScreen.styles';
import {
  ChatbotMessage,
  MOCK_CHATBOT_MESSAGES,
  USE_CHATBOT_API,
  getMockReply,
  sendChatbotMessage,
} from '../../services/chatbotService';

// ─── Icônes ───────────────────────────────────────────────────────────────────

const SendIcon = () => <Icon name="send" size={18} color={COLORS.white} />;

const FONT_BOLD = 'Montserrat-Bold';

// ─── Composant ───────────────────────────────────────────────────────────────

interface ChatbotModalProps {
  visible: boolean;
  onClose: () => void;
}

/**
 * Popup chatbot AUDYA.
 * - Glisse depuis le bas de l'écran (modal transparent)
 * - Conversation pré-chargée avec données mock (USE_CHATBOT_API = false)
 * - Bascule vers l'API réelle quand USE_CHATBOT_API = true
 */
const ChatbotModal: React.FC<ChatbotModalProps> = ({ visible, onClose }) => {
  const [messages, setMessages] = useState<ChatbotMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const flatListRef = useRef<FlatList<ChatbotMessage>>(null);

  // ── Chargement initial de la conversation ─────────────────────────────────
  useEffect(() => {
    if (!visible) {
      return;
    }
    if (USE_CHATBOT_API) {
      // Pas de chargement initial — l'API ne renvoie l'historique que si implémenté
      setMessages([]);
    } else {
      setMessages(MOCK_CHATBOT_MESSAGES);
    }
  }, [visible]);

  // ── Scroll automatique ────────────────────────────────────────────────────
  const scrollToBottom = useCallback(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, []);

  // ── Envoi d'un message ────────────────────────────────────────────────────
  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || isSending) {
      return;
    }

    const userMsg: ChatbotMessage = {
      id: Date.now(),
      isMe: true,
      text,
      timeText: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsSending(true);

    try {
      if (USE_CHATBOT_API) {
        const reply = await sendChatbotMessage(text);
        const botMsg: ChatbotMessage = {
          id: Date.now() + 1,
          isMe: false,
          text: reply,
          timeText: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, botMsg]);
      } else {
        // Simulation d'un délai de réflexion du bot
        await new Promise<void>(resolve => setTimeout(() => resolve(), 800));
        setMessages(prev => [...prev, getMockReply(text)]);
      }
    } catch {
      const errorMsg: ChatbotMessage = {
        id: Date.now() + 1,
        isMe: false,
        text: "Je rencontre une difficulté technique. Veuillez réessayer dans quelques instants.",
        timeText: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  // ── Render d'un message ───────────────────────────────────────────────────
  const renderMessage = useCallback(({ item }: { item: ChatbotMessage }) => (
    <View
      style={[
        styles.bubbleWrapper,
        item.isMe ? styles.bubbleWrapperMe : styles.bubbleWrapperBot,
      ]}
    >
      {!item.isMe && (
        <View style={styles.botAvatar}>
          <Text style={styles.botAvatarText}>IA</Text>
        </View>
      )}
      <View style={[styles.bubble, item.isMe ? styles.bubbleMe : styles.bubbleBot]}>
        <Text style={styles.bubbleText}>{item.text}</Text>
        <Text style={styles.bubbleTime}>{item.timeText}</Text>
      </View>
    </View>
  ), []);

  const canSend = inputText.trim().length > 0 && !isSending;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* Overlay semi-transparent qui ferme le modal */}
      <Pressable style={styles.overlay} onPress={onClose} />

      {/* Contenu du chatbot */}
      <KeyboardAvoidingView
        style={styles.sheet}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* En-tête teal */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.headerAvatar}>
              <Text style={styles.headerAvatarText}>IA</Text>
            </View>
            <View style={styles.aiBadge}>
              <Text style={styles.aiBadgeText}>ASSISTANT</Text>
            </View>
          </View>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>AUDYA</Text>
            <Text style={styles.headerSubtitle}>Assistant santé auditive</Text>
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            accessibilityLabel="Fermer le chatbot"
          >
            <Icon name="close" size={22} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* Liste des messages */}
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
        />

        {/* Indicateur "en train d'écrire" */}
        {isSending && (
          <View style={styles.typingIndicator}>
            <Text style={styles.typingText}>AUDYA répond…</Text>
          </View>
        )}

        {/* Zone de saisie */}
        <View style={styles.inputArea}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Posez votre question…"
            placeholderTextColor="#999999"
            multiline
            returnKeyType="default"
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity
            style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!canSend}
            accessibilityLabel="Envoyer"
          >
            <SendIcon />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',

  },
  sheet: {
    height: '72%',
    backgroundColor: '#F0F0F0',
    overflow: 'hidden',
  },

  // ── En-tête ──────────────────────────────────────────────────────────────
  header: {
    backgroundColor: COLORS.teal,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatarText: {
    fontFamily: FONT_BOLD,
    fontSize: 13,
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  aiBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: COLORS.orange,
  },
  aiBadgeText: {
    fontFamily: FONT_BOLD,
    fontSize: 9,
    color: COLORS.white,
    letterSpacing: 0.8,
  },
  headerCenter: {
    flex: 1,
    gap: 1,
  },
  headerTitle: {
    fontFamily: FONT_BOLD,
    fontSize: 16,
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontFamily: FONT_REGULAR,
    fontSize: 11,
    color: 'rgba(255,255,255,0.85)',
  },
  closeButton: {
    padding: 6,
  },

  // ── Messages ──────────────────────────────────────────────────────────────
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 12,
    paddingVertical: 14,
    gap: 12,
  },
  bubbleWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    maxWidth: '82%',
  },
  bubbleWrapperMe: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  bubbleWrapperBot: {
    alignSelf: 'flex-start',
  },
  botAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.teal,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  botAvatarText: {
    fontFamily: FONT_BOLD,
    fontSize: 10,
    color: COLORS.white,
    letterSpacing: 0.3,
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexShrink: 1,
  },
  bubbleMe: {
    backgroundColor: '#66BB6A',
    borderBottomRightRadius: 4,
  },
  bubbleBot: {
    backgroundColor: COLORS.teal,
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    fontFamily: FONT_REGULAR,
    fontSize: 14,
    color: COLORS.white,
    lineHeight: 21,
  },
  bubbleTime: {
    fontFamily: FONT_REGULAR,
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
    textAlign: 'right',
  },

  // ── Indicateur typing ─────────────────────────────────────────────────────
  typingIndicator: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#F0F0F0',
  },
  typingText: {
    fontFamily: FONT_REGULAR,
    fontSize: 12,
    color: '#999999',
    fontStyle: 'italic',
  },

  // ── Zone de saisie ────────────────────────────────────────────────────────
  inputArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    gap: 8,
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontFamily: FONT_REGULAR,
    fontSize: 14,
    color: '#2D2D2D',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
});

export default ChatbotModal;
