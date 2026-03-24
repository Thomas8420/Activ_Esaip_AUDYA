import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LogoAudya from '../../assets/images/logo-audya.svg';
import { registerStyles as s, COLORS } from '../../screens/Register/Register.styles';
import { useNavigation } from '../../context/NavigationContext';
import Bubbles from '../../components/Bubbles';

const OPTIONS_SPECIALITE = [
  'Médecin généraliste', 'ORL (Oto-Rhino-Laryngologiste)', 'Audioprothésiste',
  'Audiologiste', 'Orthophoniste', 'Neurologue', 'Gériatre', 'Pédiatre', 'Autre spécialiste',
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface SearchResult {
  id: string;
  nom: string;
  prenom: string;
  specialite: string;
  ville: string;
  codePostal: string;
}

type Errors = { ville?: string };

// ─── Mock résultats de recherche ─────────────────────────────────────────────
// À remplacer par l'appel API GET /api/professionals/search quand disponible.

const MOCK_SEARCH_RESULTS: SearchResult[] = [
  { id: '1', nom: 'Martin',  prenom: 'Sophie',  specialite: 'Audioprothésiste',           ville: 'Lyon',  codePostal: '69001' },
  { id: '2', nom: 'Durand',  prenom: 'Pierre',  specialite: 'ORL (Oto-Rhino-Laryngologiste)', ville: 'Lyon',  codePostal: '69002' },
  { id: '3', nom: 'Bernard', prenom: 'Claire',  specialite: 'Audiologiste',               ville: 'Lyon',  codePostal: '69003' },
  { id: '4', nom: 'Petit',   prenom: 'Marc',    specialite: 'Médecin généraliste',        ville: 'Paris', codePostal: '75001' },
  { id: '5', nom: 'Robert',  prenom: 'Julie',   specialite: 'Orthophoniste',              ville: 'Paris', codePostal: '75008' },
];

const RegisterStep5Page = () => {
  const { navigateTo } = useNavigation();

  const [form, setForm] = useState({ specialite: '', nom: '', prenom: '', codePostal: '', ville: '' });
  const [errors, setErrors]       = useState<Errors>({});
  const [showModal, setShowModal]  = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(null);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);

  const clearError = (field: keyof Errors) => {
    if (errors[field]) setErrors({ ...errors, [field]: undefined });
  };

  // Ville obligatoire avant toute action
  const validate = (): boolean => {
    const e: Errors = {};
    if (!form.ville.trim()) e.ville = 'Veuillez remplir ce champ !';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSearch = () => {
    if (!validate()) return;
    // TODO: remplacer par apiFetch('/api/professionals/search', { ville, specialite, nom, prenom })
    const cityLower = form.ville.trim().toLowerCase();
    const results = MOCK_SEARCH_RESULTS.filter(r => {
      const matchCity = r.ville.toLowerCase().includes(cityLower);
      const matchSpecialite = !form.specialite || r.specialite === form.specialite;
      const matchNom = !form.nom.trim() || r.nom.toLowerCase().includes(form.nom.trim().toLowerCase());
      const matchPrenom = !form.prenom.trim() || r.prenom.toLowerCase().includes(form.prenom.trim().toLowerCase());
      const matchCP = !form.codePostal.trim() || r.codePostal.includes(form.codePostal.trim());
      return matchCity && matchSpecialite && matchNom && matchPrenom && matchCP;
    });
    setSearchResults(results);
    setSelectedResult(null);
  };

  const handleSkip     = () => { navigateTo('register-success'); };
  const handleValidate = () => { navigateTo('register-success'); };

  return (
    <SafeAreaView style={s.safeArea} edges={['top']}>
      <Bubbles />
      <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        <LogoAudya width={152} height={81} style={s.logo} />

        <View style={s.card}>
          {/* Badge étape */}
          <View style={s.stepBadgeInCard}>
            <View style={s.stepBadge}><Text style={s.stepBadgeText}>5 sur 5</Text></View>
            <Text style={s.stepLabel}>Étape</Text>
          </View>

          <Text style={s.cardTitleCompact}>Ajouter un professionnel de santé</Text>
          <Text style={s.cardSubtitle}>*Champs obligatoires</Text>

          {/* Spécialité — dropdown */}
          <TouchableOpacity style={s.inputRow} onPress={() => setShowModal(true)} activeOpacity={0.7}>
            <Text style={[s.inputRowText, { color: form.specialite ? COLORS.text : COLORS.textLight }]}>
              {form.specialite || 'Spécialité'}
            </Text>
            <Text style={{ fontSize: 14, color: COLORS.textLight }}>▼</Text>
          </TouchableOpacity>

          {/* Champs optionnels */}
          <TextInput style={s.input} placeholder="Nom" placeholderTextColor={COLORS.textLight} value={form.nom} onChangeText={v => setForm({ ...form, nom: v })} />
          <TextInput style={s.input} placeholder="Prénom" placeholderTextColor={COLORS.textLight} value={form.prenom} onChangeText={v => setForm({ ...form, prenom: v })} />
          <TextInput style={s.input} placeholder="Code postal" placeholderTextColor={COLORS.textLight} keyboardType="numeric" value={form.codePostal} onChangeText={v => setForm({ ...form, codePostal: v })} />

          {/* Ville — obligatoire */}
          <TextInput
            style={[s.input, errors.ville ? s.inputError : null]}
            placeholder="Ville *" placeholderTextColor={COLORS.textLight}
            value={form.ville}
            onChangeText={v => { setForm({ ...form, ville: v }); clearError('ville'); }}
          />
          {errors.ville && <Text style={s.errorText}>⊙ {errors.ville}</Text>}

          {/* Bouton rechercher */}
          <Pressable style={({ pressed }) => [s.btnPrimarySmall, pressed && s.btnPrimarySmallPressed]} onPress={handleSearch}>
            {({ pressed }) => <Text style={[s.btnPrimaryText, pressed && s.btnPrimaryTextPressed]}>Rechercher</Text>}
          </Pressable>

          {/* Résultats de recherche */}
          {searchResults !== null && (
            <View style={{ marginTop: 12 }}>
              {searchResults.length === 0 ? (
                <Text style={[s.questionIntro, { textAlign: 'center', marginVertical: 8 }]}>
                  Aucun professionnel trouvé. Modifiez vos critères ou passez cette étape.
                </Text>
              ) : (
                searchResults.map(result => (
                  <TouchableOpacity
                    key={result.id}
                    style={[s.inputRow, selectedResult?.id === result.id && { borderColor: COLORS.orange, borderWidth: 2 }]}
                    onPress={() => setSelectedResult(result)}
                    activeOpacity={0.7}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={[s.inputRowText, { fontWeight: 'bold' }]}>{result.prenom} {result.nom}</Text>
                      <Text style={[s.inputRowText, { fontSize: 13, color: COLORS.textLight }]}>{result.specialite} — {result.ville} ({result.codePostal})</Text>
                    </View>
                    {selectedResult?.id === result.id && <Text style={{ color: COLORS.orange }}>✓</Text>}
                  </TouchableOpacity>
                ))
              )}
            </View>
          )}

          {/* Boutons bas — même taille sur la même ligne */}
          <View style={s.btnRow}>
            <Pressable style={({ pressed }) => [s.btnStep5Skip, pressed && s.btnStep5SkipPressed]} onPress={handleSkip}>
              {({ pressed }) => <Text style={[s.btnStep5SkipText, pressed && s.btnStep5SkipTextPressed]}>Je ne trouve pas mon professionnel de santé</Text>}
            </Pressable>
            <Pressable style={({ pressed }) => [s.btnStep5Validate, pressed && s.btnStep5ValidatePressed]} onPress={handleValidate}>
              {({ pressed }) => <Text style={[s.btnStep5ValidateText, pressed && s.btnStep5ValidateTextPressed]}>Je valide et je passe à l'étape suivante</Text>}
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Modal sélection spécialité */}
      <Modal visible={showModal} transparent animationType="slide" onRequestClose={() => setShowModal(false)} accessibilityViewIsModal={true}>
        <TouchableOpacity style={s.modalOverlay} onPress={() => setShowModal(false)} activeOpacity={1}>
          <View style={s.modalSheet}>
            <View style={s.modalHandle} />
            <Text style={s.modalTitle}>Choisir une spécialité</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {OPTIONS_SPECIALITE.map(option => (
                <TouchableOpacity key={option} style={[s.modalItem, form.specialite === option && s.modalItemSelected]}
                  onPress={() => { setForm({ ...form, specialite: option }); setShowModal(false); }} activeOpacity={0.7}>
                  <Text style={[s.modalItemText, form.specialite === option && s.modalItemTextSelected]}>{option}</Text>
                  {form.specialite === option && <Text style={{ color: COLORS.orange }}>✓</Text>}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default RegisterStep5Page;
