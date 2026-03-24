// src/components/Questionnaire/QuestionnaireDetailPage.tsx
import React, { useCallback, useEffect, useState } from 'react';
import {
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
  FONT_REGULAR,
  FONT_SEMIBOLD,
  FONT_BOLD,
} from '../../screens/Home/HomeScreen.styles';
import {
  formatSubmissionForExport,
  getQuestionnaire,
  getSubmissions,
  Questionnaire,
  QuestionnaireQuestion,
  QuestionnaireSubmission,
  submitQuestionnaire,
} from '../../services/questionnaireService';
import { useNavigation } from '../../context/NavigationContext';

// ─── Contrôles de réponse (module-level) ──────────────────────────────────────

interface ControlProps {
  question: QuestionnaireQuestion;
  selectedValue: number | undefined;
  onSelect: (questionId: string, value: number) => void;
}

/** Oui / Non */
const BinaryControl = ({ question, selectedValue, onSelect }: ControlProps) => (
  <View style={styles.binaryRow}>
    {question.options.map(opt => {
      const selected = selectedValue === opt.value;
      return (
        <TouchableOpacity
          key={opt.value}
          style={[styles.binaryButton, selected && styles.binaryButtonSelected]}
          onPress={() => onSelect(question.id, opt.value)}
          activeOpacity={0.7}
          accessibilityLabel={opt.label}
          accessibilityRole="radio"
          accessibilityState={{ selected }}
        >
          <Text style={[styles.binaryLabel, selected && styles.binaryLabelSelected]}>
            {opt.label}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

/** Curseur discret — scale10 (0-10) et VAS (0,10…100) */
const ScaleControl = ({ question, selectedValue, onSelect }: ControlProps) => (
  <View>
    {/* Légendes min / max */}
    {(question.minLabel || question.maxLabel) && (
      <View style={styles.scaleLabelsRow}>
        <Text style={styles.scaleMinLabel}>{question.minLabel ?? ''}</Text>
        <Text style={styles.scaleMaxLabel}>{question.maxLabel ?? ''}</Text>
      </View>
    )}
    {/* Cases numérotées */}
    <View style={styles.scaleRow}>
      {question.options.map(opt => {
        const selected = selectedValue === opt.value;
        return (
          <TouchableOpacity
            key={opt.value}
            style={[styles.scaleCell, selected && styles.scaleCellSelected]}
            onPress={() => onSelect(question.id, opt.value)}
            activeOpacity={0.7}
            accessibilityLabel={`${opt.label}`}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
          >
            <Text style={[styles.scaleCellText, selected && styles.scaleCellTextSelected]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
    {/* Indication visuelle de la valeur choisie */}
    {selectedValue !== undefined && (
      <Text style={styles.scaleSelectedHint}>
        Valeur sélectionnée : <Text style={styles.scaleSelectedValue}>{selectedValue}</Text>
      </Text>
    )}
  </View>
);

/** Radio boutons avec libellé complet — choice5 */
const ChoiceControl = ({ question, selectedValue, onSelect }: ControlProps) => (
  <View style={styles.choiceList}>
    {question.options.map(opt => {
      const selected = selectedValue === opt.value;
      return (
        <TouchableOpacity
          key={opt.value}
          style={[styles.choiceOption, selected && styles.choiceOptionSelected]}
          onPress={() => onSelect(question.id, opt.value)}
          activeOpacity={0.7}
          accessibilityLabel={opt.label}
          accessibilityRole="radio"
          accessibilityState={{ selected }}
        >
          <View style={[styles.choiceRadio, selected && styles.choiceRadioSelected]}>
            {selected && <View style={styles.choiceRadioDot} />}
          </View>
          <Text style={[styles.choiceLabel, selected && styles.choiceLabelSelected]}>
            {opt.label}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

/** Bloc question — dispatche vers le bon contrôle selon le type */
interface QuestionBlockProps {
  question: QuestionnaireQuestion;
  questionIndex: number;
  selectedValue: number | undefined;
  onSelect: (questionId: string, value: number) => void;
}

const QuestionBlock = ({
  question,
  questionIndex,
  selectedValue,
  onSelect,
}: QuestionBlockProps) => (
  <View style={styles.questionBlock}>
    <Text style={styles.questionNumber}>Question {questionIndex + 1}</Text>
    <Text style={styles.questionText}>{question.text}</Text>

    {question.type === 'binary' && (
      <BinaryControl question={question} selectedValue={selectedValue} onSelect={onSelect} />
    )}
    {(question.type === 'scale10' || question.type === 'vas') && (
      <ScaleControl question={question} selectedValue={selectedValue} onSelect={onSelect} />
    )}
    {question.type === 'choice5' && (
      <ChoiceControl question={question} selectedValue={selectedValue} onSelect={onSelect} />
    )}
  </View>
);

/** Carte d'historique avec réponses dépliables + téléchargement */
interface HistoryCardProps {
  submission: QuestionnaireSubmission;
  questionnaire: Questionnaire;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  onDownload: () => void;
}

const HistoryCard = ({
  submission,
  questionnaire,
  index,
  isExpanded,
  onToggle,
  onDownload,
}: HistoryCardProps) => {
  const date = new Date(submission.submittedAt);
  const formattedDate = date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const formattedTime = date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={styles.historyCard}>
      {/* En-tête : numéro + date + actions */}
      <View style={styles.historyCardHeader}>
        <View style={styles.historyIndexBadge}>
          <Text style={styles.historyIndexText}>#{index + 1}</Text>
        </View>

        <View style={styles.historyDateBlock}>
          <Text style={styles.historyDate}>{formattedDate}</Text>
          <Text style={styles.historyTime}>{formattedTime}</Text>
        </View>

        <View style={styles.historyActions}>
          <TouchableOpacity
            style={styles.historyActionBtn}
            onPress={onDownload}
            activeOpacity={0.7}
            accessibilityLabel="Télécharger les résultats"
            accessibilityRole="button"
          >
            <Icon name="download-outline" size={18} color={COLORS.teal} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.historyActionBtn}
            onPress={onToggle}
            activeOpacity={0.7}
            accessibilityLabel={isExpanded ? 'Masquer les réponses' : 'Voir les réponses'}
            accessibilityRole="button"
          >
            <Icon
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={18}
              color={COLORS.orange}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Réponses dépliées */}
      {isExpanded && (
        <View>
          <View style={styles.historyDivider} />
          {questionnaire.questions.map((q, idx) => {
            const value = submission.answers[q.id];
            let answerLabel = '—';

            if (value !== undefined) {
              if (q.type === 'binary') {
                answerLabel = value === 1 ? 'Oui' : 'Non';
              } else if (q.type === 'scale10') {
                answerLabel = `${value} / 10`;
              } else if (q.type === 'vas') {
                answerLabel = `${value} / 100`;
              } else {
                answerLabel = q.options.find(o => o.value === value)?.label ?? String(value);
              }
            }

            // Retire le sous-titre type "Évaluation…\n" pour l'affichage compact
            const displayText = q.text.replace(/^.+\n/, '').trim();

            return (
              <View key={q.id} style={styles.historyAnswerRow}>
                <Text style={styles.historyAnswerQuestion}>
                  Q{idx + 1}. {displayText}
                </Text>
                <View style={styles.historyAnswerPill}>
                  <Text style={styles.historyAnswerText}>{answerLabel}</Text>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

// ─── Composant Page ───────────────────────────────────────────────────────────

/**
 * QuestionnaireDetailPage — Formulaire (binary, scale10, vas, choice5) + historique.
 * Historique : réponses textuelles dépliables + téléchargement via Share natif.
 */
const QuestionnaireDetailPage = () => {
  const { selectedQuestionnaireId, goBack } = useNavigation();
  const questionnaire = selectedQuestionnaireId
    ? getQuestionnaire(selectedQuestionnaireId)
    : undefined;

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submissions, setSubmissions] = useState<QuestionnaireSubmission[]>(
    selectedQuestionnaireId ? getSubmissions(selectedQuestionnaireId) : []
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Ferme la bannière de succès automatiquement avec cleanup pour éviter les fuites mémoire
  useEffect(() => {
    if (!submitted) {return;}
    const id = setTimeout(() => setSubmitted(false), 3000);
    return () => clearTimeout(id);
  }, [submitted]);

  const handleSelect = useCallback((questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  }, []);

  const handleToggle = useCallback((submissionId: string) => {
    setExpandedId(prev => (prev === submissionId ? null : submissionId));
  }, []);

  const handleDownload = useCallback(
    async (submission: QuestionnaireSubmission) => {
      if (!questionnaire) {
        return;
      }
      try {
        const text = formatSubmissionForExport(questionnaire, submission);
        await Share.share({ message: text, title: `${questionnaire.title} — résultats` });
      } catch {
        // Share annulé ou non disponible — aucune action requise
      }
    },
    [questionnaire]
  );

  const handleSubmit = useCallback(() => {
    if (!questionnaire) {return;}
    const totalCount = questionnaire.questions.length;
    const answeredCount = questionnaire.questions.filter(q => answers[q.id] !== undefined).length;
    if (answeredCount < totalCount) {return;}
    try {
      submitQuestionnaire(questionnaire.id, answers);
      setSubmissions(getSubmissions(questionnaire.id));
      setAnswers({});
      setSubmitted(true);
    } catch {
      // L'erreur est ignorée — l'état mock ne peut pas échouer en pratique
    }
  }, [questionnaire, answers]);

  if (!questionnaire) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <NavBar />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Questionnaire introuvable.</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={goBack}
            accessibilityLabel="Retour"
            accessibilityRole="button"
          >
            <Text style={styles.backButtonText}>Retour</Text>
          </TouchableOpacity>
        </View>
        <BottomNav />
      </SafeAreaView>
    );
  }

  const answeredCount = questionnaire.questions.filter(q => answers[q.id] !== undefined).length;
  const totalCount = questionnaire.questions.length;
  const allAnswered = answeredCount === totalCount;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <NavBar />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Lien retour */}
        <TouchableOpacity
          style={styles.backRow}
          onPress={goBack}
          activeOpacity={0.7}
          accessibilityLabel="Retour aux questionnaires"
          accessibilityRole="button"
        >
          <Icon name="arrow-back" size={18} color={COLORS.orange} />
          <Text style={styles.backText}>Mes questionnaires</Text>
        </TouchableOpacity>

        {/* En-tête */}
        <View style={styles.headerCard}>
          <Text style={styles.headerTitle}>{questionnaire.title}</Text>
          <Text style={styles.headerSubtitle}>{questionnaire.subtitle}</Text>
          <View style={styles.headerDivider} />
          <Text style={styles.headerDescription}>{questionnaire.description}</Text>
        </View>

        {/* Confirmation soumission */}
        {submitted && (
          <View style={styles.successBanner}>
            <Icon name="checkmark-circle" size={20} color={COLORS.white} />
            <Text style={styles.successText}>Questionnaire enregistré avec succès !</Text>
          </View>
        )}

        {/* Barre de progression */}
        <View style={styles.progressRow}>
          <Text style={styles.progressLabel}>
            {answeredCount}/{totalCount} question{totalCount > 1 ? 's' : ''} répondue{totalCount > 1 ? 's' : ''}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${totalCount > 0 ? (answeredCount / totalCount) * 100 : 0}%` },
              ]}
            />
          </View>
        </View>

        {/* Questions */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>NOUVEAU QUESTIONNAIRE</Text>
          {questionnaire.questions.map((q, idx) => (
            <QuestionBlock
              key={q.id}
              question={q}
              questionIndex={idx}
              selectedValue={answers[q.id]}
              onSelect={handleSelect}
            />
          ))}

          <TouchableOpacity
            style={[styles.submitButton, !allAnswered && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={!allAnswered}
            accessibilityLabel="Valider le questionnaire"
            accessibilityRole="button"
          >
            <Icon
              name="checkmark-circle-outline"
              size={18}
              color={allAnswered ? COLORS.white : '#BBBBBB'}
            />
            <Text style={[styles.submitButtonText, !allAnswered && styles.submitButtonTextDisabled]}>
              {allAnswered
                ? 'Valider le questionnaire'
                : `Répondez à toutes les questions (${answeredCount}/${totalCount})`}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Historique */}
        {submissions.length > 0 && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>HISTORIQUE ({submissions.length})</Text>
            {submissions.map((sub, idx) => (
              <HistoryCard
                key={sub.id}
                submission={sub}
                questionnaire={questionnaire}
                index={idx}
                isExpanded={expandedId === sub.id}
                onToggle={() => handleToggle(sub.id)}
                onDownload={() => handleDownload(sub)}
              />
            ))}
          </View>
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

  // ── Erreur ──────────────────────────────────────────────────────────────
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  errorText: {
    fontFamily: FONT_REGULAR,
    fontSize: 15,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: COLORS.orange,
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  backButtonText: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 14,
    color: COLORS.white,
  },

  // ── Navigation ──────────────────────────────────────────────────────────
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
    paddingVertical: 4,
  },
  backText: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 14,
    color: COLORS.orange,
  },

  // ── En-tête ─────────────────────────────────────────────────────────────
  headerCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
  },
  headerTitle: {
    fontFamily: FONT_BOLD,
    fontSize: 22,
    color: COLORS.orange,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 19,
  },
  headerDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },
  headerDescription: {
    fontFamily: FONT_REGULAR,
    fontSize: 13,
    color: COLORS.textLight,
    lineHeight: 19,
  },

  // ── Confirmation ────────────────────────────────────────────────────────
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.teal,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
  },
  successText: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 14,
    color: COLORS.white,
    flex: 1,
  },

  // ── Progression ─────────────────────────────────────────────────────────
  progressRow: {
    gap: 8,
    marginBottom: 14,
  },
  progressLabel: {
    fontFamily: FONT_REGULAR,
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'right',
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.orange,
    borderRadius: 2,
  },

  // ── Section card ────────────────────────────────────────────────────────
  sectionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontFamily: FONT_BOLD,
    fontSize: 14,
    color: COLORS.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    textAlign: 'center',
    marginBottom: 18,
  },

  // ── Bloc question ────────────────────────────────────────────────────────
  questionBlock: {
    marginBottom: 22,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 20,
  },
  questionNumber: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 11,
    color: COLORS.orange,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  questionText: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 21,
    marginBottom: 14,
  },

  // ── Binary (Oui / Non) ──────────────────────────────────────────────────
  binaryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  binaryButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    alignItems: 'center',
  },
  binaryButtonSelected: {
    borderColor: COLORS.orange,
    backgroundColor: '#FEF3EE',
  },
  binaryLabel: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 16,
    color: COLORS.textLight,
  },
  binaryLabelSelected: {
    color: COLORS.orange,
  },

  // ── Scale (0-10 / VAS 0-100) ─────────────────────────────────────────────
  scaleLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  scaleMinLabel: {
    fontFamily: FONT_REGULAR,
    fontSize: 11,
    color: COLORS.textLight,
    maxWidth: '45%',
  },
  scaleMaxLabel: {
    fontFamily: FONT_REGULAR,
    fontSize: 11,
    color: COLORS.textLight,
    maxWidth: '45%',
    textAlign: 'right',
  },
  scaleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 3,
  },
  scaleCell: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 0,
  },
  scaleCellSelected: {
    borderColor: COLORS.orange,
    backgroundColor: COLORS.orange,
  },
  scaleCellText: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 10,
    color: COLORS.textLight,
  },
  scaleCellTextSelected: {
    color: COLORS.white,
  },
  scaleSelectedHint: {
    fontFamily: FONT_REGULAR,
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 8,
    textAlign: 'center',
  },
  scaleSelectedValue: {
    fontFamily: FONT_BOLD,
    color: COLORS.orange,
  },

  // ── Choice 5 (radio texte) ───────────────────────────────────────────────
  choiceList: {
    gap: 8,
  },
  choiceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  choiceOptionSelected: {
    borderColor: COLORS.orange,
    backgroundColor: '#FEF3EE',
  },
  choiceRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  choiceRadioSelected: {
    borderColor: COLORS.orange,
  },
  choiceRadioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.orange,
  },
  choiceLabel: {
    fontFamily: FONT_REGULAR,
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
    lineHeight: 20,
  },
  choiceLabelSelected: {
    fontFamily: FONT_SEMIBOLD,
    color: COLORS.orange,
  },

  // ── Bouton valider ──────────────────────────────────────────────────────
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.orange,
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginTop: 6,
  },
  submitButtonDisabled: {
    backgroundColor: '#E8E8E8',
  },
  submitButtonText: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 15,
    color: COLORS.white,
  },
  submitButtonTextDisabled: {
    color: '#BBBBBB',
  },

  // ── Historique — carte ──────────────────────────────────────────────────
  historyCard: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  historyCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  historyIndexBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  historyIndexText: {
    fontFamily: FONT_BOLD,
    fontSize: 12,
    color: COLORS.textLight,
  },
  historyDateBlock: {
    flex: 1,
  },
  historyDate: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 13,
    color: COLORS.text,
  },
  historyTime: {
    fontFamily: FONT_REGULAR,
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 2,
  },
  historyActions: {
    flexDirection: 'row',
    gap: 6,
    flexShrink: 0,
  },
  historyActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Historique — réponses ───────────────────────────────────────────────
  historyDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginTop: 12,
    marginBottom: 14,
  },
  historyAnswerRow: {
    marginBottom: 12,
  },
  historyAnswerQuestion: {
    fontFamily: FONT_REGULAR,
    fontSize: 13,
    color: COLORS.textLight,
    lineHeight: 19,
    marginBottom: 6,
  },
  historyAnswerPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8F8F8',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  historyAnswerText: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 13,
    color: COLORS.teal,
  },
});

export default QuestionnaireDetailPage;
