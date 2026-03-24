// src/components/Questionnaire/QuestionnairePage.tsx
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
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
import { COLORS, FONT_REGULAR, FONT_SEMIBOLD, FONT_BOLD } from '../../screens/Home/HomeScreen.styles';
import {
  fetchQuestionnaires,
  fetchSubmissions,
  Questionnaire,
  QuestionnaireSubmission,
} from '../../services/questionnaireService';
import { useNavigation } from '../../context/NavigationContext';
import { useLanguage } from '../../context/LanguageContext';

// ─── Sous-composant carte questionnaire (module-level — pas de perte de focus) ─

interface QuestionnaireCardProps {
  questionnaire: Questionnaire;
  submissionsCount: number;
  lastSubmittedAt: string | null;
  onPress: () => void;
}

const QuestionnaireCard = ({
  questionnaire,
  submissionsCount,
  lastSubmittedAt,
  onPress,
}: QuestionnaireCardProps) => {
  const formattedDate = lastSubmittedAt
    ? new Date(lastSubmittedAt).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityLabel={`Questionnaire ${questionnaire.title} — ${questionnaire.subtitle}`}
      accessibilityRole="button"
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleBlock}>
          <Text style={styles.cardTitle}>{questionnaire.title}</Text>
          <Text style={styles.cardSubtitle} numberOfLines={2}>
            {questionnaire.subtitle}
          </Text>
        </View>
        <View style={styles.cardBadge}>
          <Icon name="document-text-outline" size={22} color={COLORS.teal} />
        </View>
      </View>

      <View style={styles.cardDivider} />

      <View style={styles.cardFooter}>
        {submissionsCount === 0 ? (
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, styles.statusDotNew]} />
            <Text style={styles.statusTextNew}>Jamais complété</Text>
          </View>
        ) : (
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, styles.statusDotDone]} />
            <Text style={styles.statusTextDone}>
              {submissionsCount} complétion{submissionsCount > 1 ? 's' : ''}
              {formattedDate ? ` — dernier : ${formattedDate}` : ''}
            </Text>
          </View>
        )}

        <View style={styles.startButton}>
          <Text style={styles.startButtonText}>
            {submissionsCount === 0 ? 'Commencer' : 'Recommencer'}
          </Text>
          <Icon name="arrow-forward" size={14} color={COLORS.white} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

// ─── Composant Page ───────────────────────────────────────────────────────────

/**
 * QuestionnairePage — Liste des questionnaires disponibles (ERSA + EQ-5D-5L).
 * Affiche pour chaque questionnaire le nombre de complétion et la dernière date.
 */
const QuestionnairePage = () => {
  const { navigateToQuestionnaireDetail } = useNavigation();
  const { t } = useLanguage();
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [submissionsMap, setSubmissionsMap] = useState<Record<string, QuestionnaireSubmission[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const qs = await fetchQuestionnaires();
        setQuestionnaires(qs);
        const map: Record<string, QuestionnaireSubmission[]> = {};
        await Promise.all(
          qs.map(async q => {
            map[q.id] = await fetchSubmissions(q.id);
          })
        );
        setSubmissionsMap(map);
      } catch {
        // silently fail — le mock ne peut pas échouer
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handlePress = useCallback(
    (id: string) => {
      navigateToQuestionnaireDetail(id);
    },
    [navigateToQuestionnaireDetail]
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <NavBar />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>{t('screen.questionnaire')}</Text>
        <Text style={styles.pageSubtitle}>
          Complétez régulièrement vos questionnaires pour suivre l'évolution de votre santé auditive.
        </Text>

        {isLoading ? (
          <ActivityIndicator size="large" color={COLORS.orange} style={{ marginTop: 40 }} />
        ) : (
          questionnaires.map(q => {
            const subs = submissionsMap[q.id] ?? [];
            return (
              <QuestionnaireCard
                key={q.id}
                questionnaire={q}
                submissionsCount={subs.length}
                lastSubmittedAt={subs[0]?.submittedAt ?? null}
                onPress={() => handlePress(q.id)}
              />
            );
          })
        )}
      </ScrollView>

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
    marginBottom: 8,
    marginTop: 4,
  },
  pageSubtitle: {
    fontFamily: FONT_REGULAR,
    fontSize: 13,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 19,
    paddingHorizontal: 8,
  },

  // ── Carte ─────────────────────────────────────────────────────────────────
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  cardTitleBlock: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: FONT_BOLD,
    fontSize: 18,
    color: COLORS.orange,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontFamily: FONT_REGULAR,
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 19,
  },
  cardBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 14,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    paddingRight: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    flexShrink: 0,
  },
  statusDotNew: {
    backgroundColor: COLORS.border,
  },
  statusDotDone: {
    backgroundColor: COLORS.teal,
  },
  statusTextNew: {
    fontFamily: FONT_REGULAR,
    fontSize: 12,
    color: COLORS.textLight,
  },
  statusTextDone: {
    fontFamily: FONT_REGULAR,
    fontSize: 12,
    color: COLORS.text,
    flex: 1,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.orange,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 6,
    flexShrink: 0,
  },
  startButtonText: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 13,
    color: COLORS.white,
  },
});

export default QuestionnairePage;
