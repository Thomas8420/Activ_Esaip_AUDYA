// src/components/common/NavBar/NotificationPanel.tsx
import React from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  COLORS,
  FONT_BOLD,
  FONT_REGULAR,
  FONT_SEMIBOLD,
} from '../../../screens/Home/HomeScreen.styles';
import { AppNotification, NotificationType } from '../../../services/notificationService';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatRelativeTime(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) { return "à l'instant"; }
  if (minutes < 60) { return `${minutes} min`; }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) { return `${hours}h`; }
  const days = Math.floor(hours / 24);
  if (days < 7) { return `${days}j`; }
  return new Date(isoDate).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
}

const TYPE_CONFIG: Record<NotificationType, { icon: string; bg: string; iconColor: string }> = {
  message:       { icon: 'chatbubble-outline',         bg: '#E8F8F8', iconColor: COLORS.teal },
  appointment:   { icon: 'calendar-outline',           bg: '#FEF3EE', iconColor: COLORS.orange },
  questionnaire: { icon: 'document-text-outline',      bg: '#E8F8F8', iconColor: COLORS.teal },
  info:          { icon: 'information-circle-outline', bg: '#F0F0F0', iconColor: COLORS.textLight },
};

// ─── Sous-composant ligne notification (module-level) ─────────────────────────

interface NotifRowProps {
  notification: AppNotification;
  onPress: () => void;
}

const NotifRow = ({ notification, onPress }: NotifRowProps) => {
  const cfg = TYPE_CONFIG[notification.type];
  const isUnread = notification.readAt === null;

  return (
    <TouchableOpacity
      style={[styles.row, isUnread && styles.rowUnread]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityLabel={notification.title}
      accessibilityRole="button"
    >
      {/* Icône type */}
      <View style={[styles.iconCircle, { backgroundColor: cfg.bg }]}>
        <Icon name={cfg.icon} size={18} color={cfg.iconColor} />
      </View>

      {/* Contenu */}
      <View style={styles.rowContent}>
        <View style={styles.rowMeta}>
          <Text style={[styles.rowTitle, isUnread && styles.rowTitleUnread]} numberOfLines={1}>
            {notification.title}
          </Text>
          <Text style={styles.rowTime}>{formatRelativeTime(notification.createdAt)}</Text>
        </View>
        <Text style={styles.rowBody} numberOfLines={2}>
          {notification.body}
        </Text>
      </View>

      {/* Indicateur non lue */}
      {isUnread && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );
};

// ─── Composant principal ──────────────────────────────────────────────────────

const PANEL_WIDTH = Math.min(Dimensions.get('window').width - 16, 340);

interface NotificationPanelProps {
  notifications: AppNotification[];
  /** Position verticale du panel (top en px, déjà calculé avec topInset) */
  topOffset: number;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

/**
 * NotificationPanel — Popup liste des notifications affichée sous la cloche.
 * Overlay semi-transparent derrière pour fermeture au clic extérieur.
 */
const NotificationPanel = ({
  notifications,
  topOffset,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
}: NotificationPanelProps) => {
  const unreadCount = notifications.filter(n => n.readAt === null).length;

  return (
    <>
      {/* Overlay transparent — ferme le panel au clic en dehors */}
      <Pressable style={styles.overlay} onPress={onClose} />

      {/* Panel */}
      <View style={[styles.panel, { top: topOffset }]}>

        {/* En-tête */}
        <View style={styles.panelHeader}>
          <View style={styles.panelTitleRow}>
            <Icon name="notifications-outline" size={16} color={COLORS.orange} />
            <Text style={styles.panelTitle}>
              Notifications
            </Text>
            {unreadCount > 0 && (
              <View style={styles.headerBadge}>
                <Text style={styles.headerBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </View>
          {unreadCount > 0 && (
            <TouchableOpacity
              onPress={onMarkAllAsRead}
              accessibilityLabel="Tout marquer comme lu"
              accessibilityRole="button"
            >
              <Text style={styles.markAllText}>Tout lire</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.panelDivider} />

        {/* Liste ou état vide */}
        {notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="notifications-off-outline" size={32} color={COLORS.border} />
            <Text style={styles.emptyText}>Aucune notification</Text>
          </View>
        ) : (
          <ScrollView
            style={styles.list}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {notifications.map((n, idx) => (
              <React.Fragment key={n.id}>
                <NotifRow notification={n} onPress={() => onMarkAsRead(n.id)} />
                {idx < notifications.length - 1 && <View style={styles.separator} />}
              </React.Fragment>
            ))}
          </ScrollView>
        )}
      </View>
    </>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
  },
  panel: {
    position: 'absolute',
    right: 8,
    width: PANEL_WIDTH,
    maxHeight: 400,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    zIndex: 30,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    overflow: 'hidden',
  },

  // ── En-tête ──────────────────────────────────────────────────────────────
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  panelTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  panelTitle: {
    fontFamily: FONT_BOLD,
    fontSize: 15,
    color: COLORS.text,
  },
  headerBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.orange,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  headerBadgeText: {
    fontFamily: FONT_BOLD,
    fontSize: 10,
    color: COLORS.white,
  },
  markAllText: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 12,
    color: COLORS.orange,
  },
  panelDivider: {
    height: 1,
    backgroundColor: COLORS.border,
  },

  // ── Liste ────────────────────────────────────────────────────────────────
  list: {
    flexGrow: 0,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 14,
  },

  // ── État vide ────────────────────────────────────────────────────────────
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    gap: 10,
  },
  emptyText: {
    fontFamily: FONT_REGULAR,
    fontSize: 13,
    color: COLORS.textLight,
  },

  // ── Ligne notification ───────────────────────────────────────────────────
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
    backgroundColor: COLORS.white,
  },
  rowUnread: {
    backgroundColor: COLORS.offWhite,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  rowContent: {
    flex: 1,
    gap: 3,
  },
  rowMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  rowTitle: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 13,
    color: COLORS.text,
    flex: 1,
  },
  rowTitleUnread: {
    color: COLORS.orange,
  },
  rowTime: {
    fontFamily: FONT_REGULAR,
    fontSize: 11,
    color: COLORS.textLight,
    flexShrink: 0,
  },
  rowBody: {
    fontFamily: FONT_REGULAR,
    fontSize: 12,
    color: COLORS.textLight,
    lineHeight: 17,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.orange,
    flexShrink: 0,
    marginTop: 6,
  },
});

export default NotificationPanel;
