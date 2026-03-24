// src/components/News/NewsPage.tsx
import React, { useCallback, useState } from 'react';
import {
  Modal,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import NavBar from '../common/NavBar/NavBar';
import BottomNav from '../common/BottomNav/BottomNav';
import {
  COLORS,
  FONT_BOLD,
  FONT_REGULAR,
  FONT_SEMIBOLD,
} from '../../screens/Home/HomeScreen.styles';
import { getNews, NewsArticle } from '../../services/newsService';

// ─── Config catégories ────────────────────────────────────────────────────────

interface CategoryConfig {
  color: string;
  bgColor: string;
  icon: string;
}

const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  'Technologie':      { color: COLORS.orange,    bgColor: '#FEF3EE', icon: 'cellular-outline' },
  'Santé auditive':   { color: COLORS.teal,      bgColor: '#E8F8F8', icon: 'heart-outline' },
  'Prévention':       { color: COLORS.teal,      bgColor: '#E8F8F8', icon: 'shield-outline' },
  'Actualités AUDYA': { color: COLORS.orange,    bgColor: '#FEF3EE', icon: 'megaphone-outline' },
  'Administratif':    { color: COLORS.textLight, bgColor: '#F0F0F0', icon: 'document-text-outline' },
};

const DEFAULT_CONFIG: CategoryConfig = {
  color: COLORS.textLight,
  bgColor: '#F0F0F0',
  icon: 'newspaper-outline',
};

function getCategoryConfig(category: string): CategoryConfig {
  return CATEGORY_CONFIG[category] ?? DEFAULT_CONFIG;
}

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

// ─── Sous-composants module-level ─────────────────────────────────────────────

interface ArticleCardProps {
  article: NewsArticle;
  onPress: () => void;
}

const ArticleCard = ({ article, onPress }: ArticleCardProps) => {
  const config = getCategoryConfig(article.category);
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityLabel={article.title}
      accessibilityRole="button"
    >
      {/* Bandeau catégorie */}
      <View style={[styles.cardBanner, { backgroundColor: config.bgColor }]}>
        <View style={[styles.categoryBadge, { backgroundColor: config.color }]}>
          <Text style={styles.categoryBadgeText}>{article.category}</Text>
        </View>
        <View style={[styles.categoryIconCircle, { backgroundColor: config.color }]}>
          <Icon name={config.icon} size={22} color={COLORS.white} />
        </View>
      </View>

      {/* Contenu */}
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {article.title}
        </Text>
        <Text style={styles.cardExcerpt} numberOfLines={3}>
          {article.excerpt}
        </Text>

        {/* Pied de carte */}
        <View style={styles.cardFooter}>
          <View style={styles.cardMeta}>
            <Icon name="calendar-outline" size={12} color={COLORS.textLight} />
            <Text style={styles.cardMetaText}>{formatDate(article.date)}</Text>
            <Text style={styles.cardMetaDot}>·</Text>
            <Icon name="time-outline" size={12} color={COLORS.textLight} />
            <Text style={styles.cardMetaText}>{article.readMinutes} min</Text>
          </View>
          <View style={[styles.readButton, { backgroundColor: config.color }]}>
            <Text style={styles.readButtonText}>Lire</Text>
            <Icon name="arrow-forward" size={12} color={COLORS.white} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// ─── Composant Page ───────────────────────────────────────────────────────────

/**
 * NewsPage — Liste des articles de santé auditive et actualités AUDYA.
 * Lecture en modal plein-écran, partage via Share natif.
 */
const NewsPage = () => {
  const articles = getNews();
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  const handleOpen = useCallback((article: NewsArticle) => {
    setSelectedArticle(article);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedArticle(null);
  }, []);

  const handleShare = useCallback(async () => {
    if (!selectedArticle) {
      return;
    }
    try {
      await Share.share({
        message: `${selectedArticle.title}\n\n${selectedArticle.content}\n\nVia AUDYA`,
        title: selectedArticle.title,
      });
    } catch (err) {
      console.error('[NewsPage] Erreur partage:', err);
    }
  }, [selectedArticle]);

  const config = selectedArticle ? getCategoryConfig(selectedArticle.category) : DEFAULT_CONFIG;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <NavBar />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>MES ACTUALITÉS</Text>
        <Text style={styles.pageSubtitle}>
          Conseils, nouveautés et informations pour votre santé auditive.
        </Text>

        {articles.map(article => (
          <ArticleCard
            key={article.id}
            article={article}
            onPress={() => handleOpen(article)}
          />
        ))}
      </ScrollView>

      {/* Modal article — rendu conditionnel pour éviter le bug Android */}
      {selectedArticle && (
        <Modal
          visible
          animationType="slide"
          transparent={false}
          onRequestClose={handleClose}
          accessibilityViewIsModal
        >
          <SafeAreaView style={styles.modalSafeArea} edges={['top', 'bottom']}>
            {/* Barre de navigation modale */}
            <View style={[styles.modalNavBar, { backgroundColor: config.bgColor }]}>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={handleClose}
                activeOpacity={0.7}
                accessibilityLabel="Fermer l'article"
                accessibilityRole="button"
              >
                <Icon name="arrow-back" size={22} color={config.color} />
              </TouchableOpacity>

              <View style={[styles.modalCategoryBadge, { backgroundColor: config.color }]}>
                <Icon name={config.icon} size={13} color={COLORS.white} />
                <Text style={styles.modalCategoryText}>{selectedArticle.category}</Text>
              </View>

              <TouchableOpacity
                style={styles.modalShareBtn}
                onPress={handleShare}
                activeOpacity={0.7}
                accessibilityLabel="Partager l'article"
                accessibilityRole="button"
              >
                <Icon name="share-outline" size={22} color={config.color} />
              </TouchableOpacity>
            </View>

            {/* Contenu de l'article */}
            <ScrollView
              contentContainerStyle={styles.modalScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Méta */}
              <View style={styles.modalMeta}>
                <Icon name="calendar-outline" size={13} color={COLORS.textLight} />
                <Text style={styles.modalMetaText}>{formatDate(selectedArticle.date)}</Text>
                <Text style={styles.modalMetaDot}>·</Text>
                <Icon name="time-outline" size={13} color={COLORS.textLight} />
                <Text style={styles.modalMetaText}>{selectedArticle.readMinutes} min de lecture</Text>
              </View>

              {/* Titre */}
              <Text style={styles.modalTitle}>{selectedArticle.title}</Text>

              {/* Divider */}
              <View style={[styles.modalTitleDivider, { backgroundColor: config.color }]} />

              {/* Chapeau */}
              <Text style={styles.modalExcerpt}>{selectedArticle.excerpt}</Text>

              {/* Corps — rendu paragraphe par paragraphe */}
              {selectedArticle.content.split('\n\n').map((para, idx) => (
                <Text key={idx} style={styles.modalParagraph}>
                  {para.trim()}
                </Text>
              ))}

              {/* Bouton partager bas de page */}
              <TouchableOpacity
                style={[styles.modalShareButtonFull, { borderColor: config.color }]}
                onPress={handleShare}
                activeOpacity={0.8}
                accessibilityLabel="Partager cet article"
                accessibilityRole="button"
              >
                <Icon name="share-social-outline" size={18} color={config.color} />
                <Text style={[styles.modalShareButtonText, { color: config.color }]}>
                  Partager cet article
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        </Modal>
      )}

      <BottomNav />
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 100,
  },

  pageTitle: {
    fontSize: 20,
    fontFamily: FONT_BOLD,
    color: COLORS.orange,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
    marginTop: 4,
  },
  pageSubtitle: {
    fontFamily: FONT_REGULAR,
    fontSize: 13,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 19,
  },

  // ── Carte article ────────────────────────────────────────────────────────
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
  },
  cardBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  categoryBadge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  categoryBadgeText: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 11,
    color: COLORS.white,
    letterSpacing: 0.3,
  },
  categoryIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    padding: 14,
    gap: 8,
  },
  cardTitle: {
    fontFamily: FONT_BOLD,
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 22,
  },
  cardExcerpt: {
    fontFamily: FONT_REGULAR,
    fontSize: 13,
    color: COLORS.textLight,
    lineHeight: 19,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  cardMetaText: {
    fontFamily: FONT_REGULAR,
    fontSize: 11,
    color: COLORS.textLight,
  },
  cardMetaDot: {
    fontFamily: FONT_REGULAR,
    fontSize: 11,
    color: COLORS.textLight,
  },
  readButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexShrink: 0,
  },
  readButtonText: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 12,
    color: COLORS.white,
  },

  // ── Modal ────────────────────────────────────────────────────────────────
  modalSafeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  modalNavBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  modalCloseBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCategoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  modalCategoryText: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 12,
    color: COLORS.white,
  },
  modalShareBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  modalMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 12,
  },
  modalMetaText: {
    fontFamily: FONT_REGULAR,
    fontSize: 12,
    color: COLORS.textLight,
  },
  modalMetaDot: {
    fontFamily: FONT_REGULAR,
    fontSize: 12,
    color: COLORS.textLight,
  },
  modalTitle: {
    fontFamily: FONT_BOLD,
    fontSize: 22,
    color: COLORS.text,
    lineHeight: 30,
    marginBottom: 14,
  },
  modalTitleDivider: {
    height: 3,
    width: 40,
    borderRadius: 2,
    marginBottom: 16,
  },
  modalExcerpt: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 23,
    marginBottom: 20,
  },
  modalParagraph: {
    fontFamily: FONT_REGULAR,
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 24,
    marginBottom: 16,
  },
  modalShareButtonFull: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderRadius: 25,
    paddingVertical: 14,
    marginTop: 8,
  },
  modalShareButtonText: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 14,
  },
});

export default NewsPage;
