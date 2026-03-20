import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f3ef' },
  scrollContent: { padding: 15, paddingBottom: 100 },
  card: {
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 20,
    minHeight: 600,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
    color: '#F15A24',
    textAlign: 'center',
    marginBottom: 30,
    textTransform: 'uppercase',
  },
  controlsContainer: { marginBottom: 20, zIndex: 10 },
  rowTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  label: { fontFamily: 'Montserrat-Bold', color: '#1A3B5D', marginRight: 10 },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 38,
    marginRight: 10,
  },
  searchInput: { flex: 1, fontSize: 12, color: '#333' },
  rightControl: { flexDirection: 'row', alignItems: 'center' },
  displayText: { fontSize: 11, color: '#999', marginRight: 5 },
  displayIcons: { flexDirection: 'row', gap: 10 },

  rowBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    paddingLeft: 15,
    paddingRight: 5,
    height: 38,
    width: 140,
  },
  dropdownText: { fontSize: 13, color: '#666' },
  dropdownArrowBg: {
    backgroundColor: '#D3D3D3',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownList: {
    position: 'absolute',
    top: 42,
    left: 0,
    width: 140,
    backgroundColor: 'white',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 5,
  },
  dropdownItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  dropdownItemText: { fontSize: 12, color: '#333' },

  addButton: {
    backgroundColor: '#F15A24',
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  addButtonText: { color: 'white', fontFamily: 'Montserrat-Bold', fontSize: 12 },

  // TIMELINE
  timelineContainer: { marginTop: 20 },
  verticalLine: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#D3D3D3',
  },
  timelineItem: { width: '50%', marginBottom: 30 },
  leftItem: { alignSelf: 'flex-start', paddingRight: 20 },
  rightItem: { alignSelf: 'flex-end', paddingLeft: 20 },
  timelineIconWrapper: {
    position: 'absolute',
    top: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'white',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  iconLeft: { right: -15, borderColor: '#F15A24' },
  iconRight: { left: -15, borderColor: '#3ABFBF' },
  itemContent: {
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  author: { fontSize: 11, fontWeight: 'bold', color: '#666' },
  dateText: { fontSize: 10, color: '#999', marginBottom: 5 },
  docTitle: { fontSize: 13, fontFamily: 'Montserrat-Bold', color: '#1A3B5D' },
  docDesc: { fontSize: 11, color: '#444', marginTop: 3 },
  actionIcons: { flexDirection: 'row', gap: 15, marginTop: 15, alignItems: 'center' },

// --- Styles pour la Modale d'Ajout ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    minHeight: 400
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F15A24',
    marginBottom: 20,
    textAlign: 'center'
  },
  inputLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
    fontWeight: 'bold'
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#F9F9F9'
  },
  uploadButtonModal: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#CCC',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    marginBottom: 25
  },
  uploadButtonTextModal: {
    color: '#666',
    fontWeight: '500'
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#EEE',
    marginRight: 10
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: 'bold'
  },
  saveButton: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#F15A24',
    marginLeft: 10
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold'
  },

// Styles pour la Liste
  tableContainer: { marginTop: 10, borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: '#EEE' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#F0F0F0', paddingVertical: 12, paddingHorizontal: 5 },
  headerText: { fontSize: 10, fontFamily: 'Montserrat-Bold', color: '#888' },
  tableRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#EEE', paddingHorizontal: 5 },
  rowText: { fontSize: 11, fontFamily: 'Montserrat-Medium' },
  eyeCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center' },
  rowActions: { flexDirection: 'row', justifyContent: 'space-around' },

  // Styles pour la Grille
  gridContainer: { marginTop: 20 },
  gridItem: { marginBottom: 25, backgroundColor: 'white', borderRadius: 15, elevation: 3, padding: 10 },
  imagePlaceholder: { height: 200, backgroundColor: '#F9F9F9', borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#EEE' },
  gridCaption: { flexDirection: 'row', backgroundColor: '#E0E0E0', padding: 10, marginTop: 10, borderRadius: 5 },
  captionLabel: { flex: 1, fontSize: 12, fontWeight: 'bold' },
  captionValue: { flex: 1, fontSize: 12 },

  // TABLEAU (VUE LISTE)
  tableContainer: { marginTop: 20 },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    padding: 10,
    borderRadius: 5
  },
  headerText: { fontSize: 10, fontFamily: 'Montserrat-Bold', color: '#666' },
  tableRow: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    alignItems: 'center'
  },
  rowText: { fontSize: 11, color: '#333' },
  rowActions: { flexDirection: 'row', gap: 15 }
});
