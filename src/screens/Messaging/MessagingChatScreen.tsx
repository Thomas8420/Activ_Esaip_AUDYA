import React from 'react';
import { useNavigation } from '../../context/NavigationContext';
import MessagingChatPage from '../../components/Messaging/MessagingChatPage';

/**
 * Écran de conversation — conteneur mince.
 * Récupère la conversation sélectionnée depuis NavigationContext.
 */
const MessagingChatScreen = () => {
  const { selectedConversation } = useNavigation();
  if (!selectedConversation) {
    return null;
  }
  return <MessagingChatPage conversation={selectedConversation} />;
};

export default MessagingChatScreen;
