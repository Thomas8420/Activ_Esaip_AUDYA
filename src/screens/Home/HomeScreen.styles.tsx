import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const COLORS = {
  // Palette principale — valeurs WCAG AA (ratio ≥ 4.5:1 sur fond blanc)
  orange: '#C44D1A',       // Anciennement #E8622A (ratio 3.1:1) — corrigé à 4.6:1
  orangeLight: '#E07040',  // Teinte claire pour hover/pressed
  teal: '#1A7A7A',         // Anciennement #3ABFBF (ratio 2.4:1) — corrigé à 4.6:1
  white: '#FFFFFF',
  offWhite: '#F8F9FA',
  tile: '#FFFFFF',
  text: '#2D2D2D',
  textLight: '#6B6B6B',    // Ratio 5.74:1 — conforme
  placeholder: '#767676',  // Ratio 4.54:1 — minimum accessible pour les placeholders
  border: '#E0E0E0',       // Bordures décoratives non interactives
  borderInteractive: '#767676', // Bordures checkbox/radio — ratio 4.54:1 (WCAG 1.4.11)
  background: '#f5f3ef',
  overlay: 'rgba(0, 0, 0, 0.4)', // Filtre gris
};

// --- POLICES MONTSERRAT ---
export const FONT_REGULAR = 'Montserrat-Regular';
export const FONT_SEMIBOLD = 'Montserrat-SemiBold';

const TILE_GAP = 16;
const TILE_PADDING = 20;
const TILE_SIZE = (width - (TILE_PADDING * 2) - TILE_GAP) / 2;

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.offWhite,
  },
  // ── Header (Logo à gauche, Pilule orange à droite) ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.background,
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.orange,
      borderRadius: 30,
      paddingHorizontal: 12,
      paddingVertical: 5,
      gap: 8,
    },
  headerIconBtn: {
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Dropdown Profil (Main Page 3) ──
  dropdownOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.overlay,
    zIndex: 20,
  },
  dropdown: {
    position: 'absolute',
    top: 25,
    right: 16,
    width: 192,
    backgroundColor: COLORS.orangeLight,
    borderRadius: 12,
    paddingVertical: 8,
    zIndex: 30,
    elevation: 8,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  dropdownSeparator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 15,
  },
  dropdownLabel: {
    fontSize: 14,
    fontFamily: FONT_REGULAR,
    color: COLORS.white,
    marginLeft: 10,
  },

  // ── Grille & Tuiles ──
  scrollContent: {
    paddingHorizontal: TILE_PADDING,
    paddingTop: 10,
    paddingBottom: 100,
    backgroundColor: COLORS.background,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: TILE_GAP,
    justifyContent: 'center',
  },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE * 0.95,
    backgroundColor: COLORS.tile,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  tileLabel: {
    fontSize: width > 380 ? 16 : 13,
    fontFamily: FONT_SEMIBOLD,
    color: COLORS.text,
    textAlign: 'center',
    marginTop: 12,
  },

  // ── Bannière (Main Page 2) ──
  bannerContainer: {
    marginTop: 25,
    width: '100%',
    height: 220,
    borderRadius: 20,
    overflow: 'hidden',
  },
  bannerImage: { width: '100%', height: '100%' },
  bannerOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 15,
    right: 15,
    backgroundColor: 'rgba(232, 98, 42, 0.95)',
    padding: 15,
    borderRadius: 12,
  },
  bannerText: {
    color: COLORS.white,
    fontFamily: FONT_SEMIBOLD,
    fontSize: 14,
    textAlign: 'center',
  },

  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.teal,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  }
});