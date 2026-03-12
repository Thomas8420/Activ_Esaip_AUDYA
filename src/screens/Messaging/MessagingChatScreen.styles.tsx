import { StyleSheet } from 'react-native';

export const COLORS = {
  orange:      '#E8622A',
  teal:        '#3ABFBF',
  white:       '#FFFFFF',
  offWhite:    '#F8F9FA',
  text:        '#2D2D2D',
  textLight:   '#6B6B6B',
  textLighter: '#999999',
  border:      '#E0E0E0',
  background:  '#F0F0F0',
  msgMe:       '#66BB6A',  // vert  → patient (moi)
  msgAdmin:    '#42A5F5',  // bleu  → admin
  msgPro:      '#3ABFBF',  // teal  → professionnel
  inputBg:     '#FFFFFF',
};

export const FONT_REGULAR  = 'Montserrat-Regular';
export const FONT_SEMIBOLD = 'Montserrat-SemiBold';
export const FONT_BOLD     = 'Montserrat-Bold';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  flex: { flex: 1 },

  // ── Chat header bar ────────────────────────────────────────────────────────
  chatHeader: {
    backgroundColor: COLORS.teal,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  chatHeaderLeft: {
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
    fontSize: 14,
    color: COLORS.white,
  },
  proBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  proBadgeText: {
    fontFamily: FONT_BOLD,
    fontSize: 10,
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  chatHeaderCenter: {
    flex: 1,
    gap: 2,
  },
  headerPhone: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 12,
    color: COLORS.white,
  },
  headerEmail: {
    fontFamily: FONT_REGULAR,
    fontSize: 11,
    color: 'rgba(255,255,255,0.85)',
  },
  closeButton: {
    padding: 6,
  },
  closeButtonText: {
    fontFamily: FONT_BOLD,
    fontSize: 18,
    color: COLORS.white,
    lineHeight: 20,
  },

  // ── Contact sub-header ─────────────────────────────────────────────────────
  subHeader: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  subHeaderName: {
    fontFamily: FONT_BOLD,
    fontSize: 15,
    color: COLORS.text,
  },
  subHeaderLocation: {
    fontFamily: FONT_REGULAR,
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },

  // ── Messages list ──────────────────────────────────────────────────────────
  messagesList: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  messagesContent: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 10,
  },

  // ── Message bubble ─────────────────────────────────────────────────────────
  messageBubbleWrapper: {
    maxWidth: '78%',
  },
  messageBubbleWrapperMe: {
    alignSelf: 'flex-end',
  },
  messageBubbleWrapperThem: {
    alignSelf: 'flex-start',
  },
  messageSenderName: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 11,
    marginBottom: 3,
    marginLeft: 4,
  },
  messageBubble: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  messageBubbleMe: {
    backgroundColor: COLORS.msgMe,
    borderBottomRightRadius: 4,
  },
  messageBubbleAdmin: {
    backgroundColor: COLORS.msgAdmin,
    borderBottomLeftRadius: 4,
  },
  messageBubblePro: {
    backgroundColor: COLORS.msgPro,
    borderBottomLeftRadius: 4,
  },
  messageBubbleText: {
    fontFamily: FONT_REGULAR,
    fontSize: 14,
    color: COLORS.white,
    lineHeight: 20,
  },
  messageTime: {
    fontFamily: FONT_REGULAR,
    fontSize: 10,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 4,
    textAlign: 'right',
  },

  // ── File attachments in messages ───────────────────────────────────────────
  attachmentRow: {
    marginTop: 6,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  attachmentImage: {
    width: 120,
    height: 90,
    borderRadius: 8,
  },
  attachmentDoc: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 6,
    maxWidth: 180,
  },
  attachmentDocText: {
    fontFamily: FONT_REGULAR,
    fontSize: 12,
    color: COLORS.white,
    flex: 1,
  },

  // ── Pending attachments strip ──────────────────────────────────────────────
  pendingStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 8,
    flexWrap: 'wrap',
  },
  pendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.offWhite,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pendingItemText: {
    fontFamily: FONT_REGULAR,
    fontSize: 12,
    color: COLORS.text,
    maxWidth: 120,
  },
  pendingRemove: {
    fontFamily: FONT_BOLD,
    fontSize: 14,
    color: COLORS.textLighter,
    lineHeight: 16,
  },

  // ── Input area ─────────────────────────────────────────────────────────────
  inputArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 8,
  },
  attachButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: COLORS.offWhite,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontFamily: FONT_REGULAR,
    fontSize: 14,
    color: COLORS.text,
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
    backgroundColor: COLORS.border,
  },
});
