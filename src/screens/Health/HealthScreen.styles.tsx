import { StyleSheet } from 'react-native';

export const COLORS = {
  orange: '#E8622A',
  teal: '#3ABFBF',
  white: '#FFFFFF',
  offWhite: '#F8F9FA',
  text: '#24345A',
  textLight: '#6B6B6B',
  textLighter: '#999999',
  border: '#D9D9D9',
  background: '#F5F3EF',
  yellow: '#F7C600',
  blueBorder: '#2298F0',
};

export const FONT_REGULAR = 'Montserrat-Regular';
export const FONT_SEMIBOLD = 'Montserrat-SemiBold';
export const FONT_BOLD = 'Montserrat-Bold';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 100,
    backgroundColor: COLORS.background,
  },

  titleSection: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 4,
  },
  title: {
    fontSize: 36,
    fontFamily: FONT_BOLD,
    color: COLORS.orange,
    textAlign: 'center',
  },

  summaryCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 0,
    borderWidth: 2,
    borderColor: COLORS.blueBorder,
    padding: 16,
    marginBottom: 20,
    marginTop: 10,
  },
  summaryTopTitle: {
    fontSize: 42,
    fontFamily: FONT_BOLD,
    color: COLORS.orange,
    textAlign: 'center',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryIdentity: {
    flex: 1,
    paddingRight: 12,
  },
  summaryNameLine: {
    fontFamily: FONT_BOLD,
    fontSize: 15,
    color: COLORS.text,
    marginBottom: 4,
  },
  summaryAddressLine: {
    fontFamily: FONT_REGULAR,
    fontSize: 13,
    color: COLORS.text,
    marginBottom: 2,
  },
  verticalDivider: {
    width: 2,
    height: 80,
    backgroundColor: '#999999',
    marginHorizontal: 15,
  },
  bmiBlock: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
  },
  summaryMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metricDivider: {
    width: 1,
    height: 56,
    backgroundColor: '#999999',
  },
  bmiLabel: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 10,
    color: COLORS.text,
    marginBottom: 6,
    textAlign: 'center',
  },
  bmiCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.yellow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bmiValue: {
    fontFamily: FONT_BOLD,
    fontSize: 16,
    color: COLORS.text,
  },
  qrCodeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  sectionCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  sectionTitle: {
    fontSize: 32,
    fontFamily: FONT_BOLD,
    color: COLORS.orange,
    textAlign: 'center',
    marginBottom: 20,
  },

  twoColumnRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  fieldColumn: {
    flex: 1,
  },
  fieldLabel: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 6,
  },
  fieldValuePill: {
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fieldValueText: {
    fontFamily: FONT_REGULAR,
    fontSize: 15,
    color: '#5E6E8A',
  },
  chevronBubble: {
    width: 28,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#D3D3D3',
    alignItems: 'center',
    justifyContent: 'center',
  },

  textInputReadonly: {
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    fontFamily: FONT_REGULAR,
    fontSize: 15,
    color: '#5E6E8A',
  },

  subsectionLabel: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 18,
    color: COLORS.text,
    marginTop: 10,
    marginBottom: 8,
  },
  inlineRowCard: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 10,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  inlineInputLike: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  inlineInputLikeText: {
    fontFamily: FONT_REGULAR,
    fontSize: 14,
    color: '#888888',
  },
  inlineDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 12,
  },
  documentButton: {
    minWidth: 100,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  documentButtonText: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 14,
    color: COLORS.text,
  },

  tagsWrap: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    borderRadius: 12,
    backgroundColor: COLORS.orange,
    paddingVertical: 6,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagText: {
    fontFamily: FONT_REGULAR,
    fontSize: 12,
    color: COLORS.white,
  },
  tagClose: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: FONT_SEMIBOLD,
    marginLeft: 4,
  },

  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingLeft: 4,
  },
  fileName: {
    marginLeft: 10,
    fontFamily: FONT_REGULAR,
    fontSize: 13,
    color: COLORS.text,
  },
});

