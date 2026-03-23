import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LogoAudya from '../../assets/images/logo-audya.svg';
import { registerStyles as s, COLORS } from '../../screens/Register/Register.styles';
import { useNavigation } from '../../context/NavigationContext';
import Bubbles from '../../components/Bubbles';

// Options des dropdowns
const OUI_NON = ['Oui', 'Non'];
const OPTIONS_Q1 = ['Moins de 6 mois', '6 mois', '1 an', '2 ans', '3 ans', '4 ans', '5 ans', 'Plus de 5 ans'];
const OPTIONS_Q3 = ['Progressivement, lentement', 'Progressivement, rapidement', 'Brutalement', 'Par paliers', 'Je ne sais pas'];
const SITUATIONS = [
  'Le restaurant', 'Les salles de spectacles ou de cinéma', 'Les discussions de groupe',
  'La télévision', 'Lorsque je ne peux pas lire sur les lèvres', 'Lorsque je suis en extérieur',
];

// Questions Oui/Non avec leur état et libellé
const QUESTIONS_OUI_NON = [
  { label: '2. Avez-vous déjà porté un dispositif auditif ?',                    title: 'Avez-vous déjà porté un dispositif auditif ?' },
  { label: "4. Un événement particulier est-il à l'origine de votre surdité ?",  title: "Un événement est-il à l'origine de votre surdité ?" },
  { label: '5. Votre surdité est-elle plus marquée dans une oreille que dans l\'autre ?', title: 'Surdité plus marquée dans une oreille ?' },
  { label: '6. Avez-vous des vertiges ou instabilités ?',                        title: 'Avez-vous des vertiges ou instabilités ?' },
  { label: '7. Avez-vous des acouphènes ?',                                      title: 'Avez-vous des acouphènes ?' },
  { label: '8. Portez-vous des lunettes ?',                                      title: 'Portez-vous des lunettes ?' },
  { label: '9. Avez-vous des difficultés à manipuler les petits objets ?',       title: 'Difficultés à manipuler les petits objets ?' },
];

type ModalConfig = { visible: boolean; title: string; options: string[]; value: string; onSelect: (v: string) => void };

// ─── Sous-composants au niveau module ────────────────────────────────────────
// Déclarés HORS du corps de RegisterStep3Page pour éviter le démontage/remontage
// à chaque re-render (anti-pattern clavier décrit dans CLAUDE.md).

type DropdownProps = { label: string; value: string; placeholder: string; onOpen: () => void };

const Dropdown = ({ label, value, placeholder, onOpen }: DropdownProps) => (
  <View style={s.questionBlock}>
    <Text style={s.questionText}>{label}</Text>
    <TouchableOpacity style={s.inputRow} onPress={onOpen} activeOpacity={0.7}>
      <Text style={[s.inputRowText, { color: value ? COLORS.text : COLORS.textLight }]}>{value || placeholder}</Text>
      <Text style={{ color: COLORS.textLight }}>▼</Text>
    </TouchableOpacity>
  </View>
);

type CheckboxGroupProps = { label: string; list: string[]; onToggle: (item: string) => void };

const CheckboxGroup = ({ label, list, onToggle }: CheckboxGroupProps) => (
  <View style={s.questionBlock}>
    <Text style={s.questionText}>{label}</Text>
    {SITUATIONS.map(item => (
      <TouchableOpacity key={item} style={s.checkboxRow} onPress={() => onToggle(item)} activeOpacity={0.7}>
        <View style={[s.checkbox, list.includes(item) && s.checkboxGreen]}>
          {list.includes(item) && <Text style={{ color: COLORS.white, fontSize: 12 }}>✓</Text>}
        </View>
        <Text style={s.checkboxLabel}>{item}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

// ─────────────────────────────────────────────────────────────────────────────

const RegisterStep3Page = () => {
  const { navigateTo } = useNavigation();

  // États des réponses (q2..q9 groupés, q10 et q10b séparés)
  const [q1, setQ1]   = useState('');
  const [q3, setQ3]   = useState('');
  const [q10, setQ10]   = useState<string[]>([]);
  const [q10b, setQ10b] = useState<string[]>([]);
  const [ouiNon, setOuiNon] = useState<string[]>(Array(7).fill(''));

  const [modal, setModal] = useState<ModalConfig>({ visible: false, title: '', options: [], value: '', onSelect: () => {} });

  const openModal = (title: string, options: string[], value: string, onSelect: (v: string) => void) =>
    setModal({ visible: true, title, options, value, onSelect });
  const closeModal = () => setModal(prev => ({ ...prev, visible: false }));

  const toggleSituation = (list: string[], setList: (v: string[]) => void, item: string) =>
    setList(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);

  return (
    <SafeAreaView style={s.safeArea} edges={['top']}>
      <Bubbles />
      <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        <LogoAudya width={152} height={81} style={s.logo} />

        <View style={s.card}>
          {/* Badge étape */}
          <View style={s.stepBadgeInCard}>
            <View style={s.stepBadge}><Text style={s.stepBadgeText}>3 sur 5</Text></View>
            <Text style={s.stepLabel}>Étape</Text>
          </View>

          <Text style={s.cardTitleCompact}>Questionnaire auditif</Text>
          <Text style={s.questionIntro}>Veuillez compléter ce court questionnaire qui décrit les grandes lignes de votre cadre de vie</Text>

          <View style={s.separator} />

          {/* Q1 — durée de la gêne */}
          <Dropdown label="1. Depuis combien de temps ressentez-vous une gêne auditive ?" value={q1} placeholder="< 6 mois"
            onOpen={() => openModal('Depuis combien de temps ?', OPTIONS_Q1, q1, setQ1)} />

          {/* Q2 à Q9 — questions Oui/Non générées dynamiquement */}
          {QUESTIONS_OUI_NON.map((q, i) => {
            const indexes = [1, 3, 4, 5, 6, 7, 8]; // numéros de questions correspondants
            return (
              <Dropdown
                key={i}
                label={q.label}
                value={ouiNon[i]}
                placeholder="Non"
                onOpen={() => openModal(q.title, OUI_NON, ouiNon[i], v => {
                  const updated = [...ouiNon];
                  updated[i] = v;
                  setOuiNon(updated);
                })}
              />
            );
          })}

          {/* Q3 — évolution de la surdité (inséré après Q2) */}
          <Dropdown label="3. Comment votre surdité a-t-elle évolué ?" value={q3} placeholder="Progressivement, lentement"
            onOpen={() => openModal('Comment a évolué votre surdité ?', OPTIONS_Q3, q3, setQ3)} />

          {/* Q10 et Q10 bis — situations difficiles (cases vertes) */}
          <CheckboxGroup label="10. Dans quelles situations votre audition vous cause-t-elle le plus de difficultés ou d'inconfort ?" list={q10} onToggle={item => toggleSituation(q10, setQ10, item)} />
          <CheckboxGroup label="10. Dans quelles situations votre audition vous cause-t-elle le plus de difficultés ou d'inconfort ?" list={q10b} onToggle={item => toggleSituation(q10b, setQ10b, item)} />

          {/* Bouton valider */}
          <Pressable style={({ pressed }) => [s.btnPrimarySmall, pressed && s.btnPrimarySmallPressed]} onPress={() => navigateTo('register-step4')}>
            {({ pressed }) => <Text style={[s.btnPrimaryText, pressed && s.btnPrimaryTextPressed]}>Je valide le questionnaire</Text>}
          </Pressable>
        </View>
      </ScrollView>

      {/* Modal générique réutilisé pour toutes les questions */}
      <Modal visible={modal.visible} transparent animationType="slide" onRequestClose={closeModal}>
        <TouchableOpacity style={s.modalOverlay} onPress={closeModal} activeOpacity={1}>
          <View style={s.modalSheet}>
            <View style={s.modalHandle} />
            <Text style={s.modalTitle}>{modal.title}</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {modal.options.map(option => (
                <TouchableOpacity key={option} style={[s.modalItem, modal.value === option && s.modalItemSelected]}
                  onPress={() => { modal.onSelect(option); closeModal(); }} activeOpacity={0.7}>
                  <Text style={[s.modalItemText, modal.value === option && s.modalItemTextSelected]}>{option}</Text>
                  {modal.value === option && <Text style={{ color: COLORS.orange }}>✓</Text>}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default RegisterStep3Page;
