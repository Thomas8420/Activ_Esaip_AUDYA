/**
 * Mock for react-native-document-picker
 * Prevents TurboModuleRegistry errors in Jest tests.
 */
const DocumentPicker = {
  pick: jest.fn().mockResolvedValue([]),
  pickSingle: jest.fn().mockResolvedValue({}),
  isCancel: jest.fn().mockReturnValue(false),
  releaseSecureAccess: jest.fn().mockResolvedValue(undefined),
};

const types = {
  allFiles: 'public.all-files',
  images: 'public.image',
  plainText: 'public.plain-text',
  audio: 'public.audio',
  pdf: 'com.adobe.pdf',
  zip: 'public.zip-archive',
  doc: 'com.microsoft.word.doc',
  docx: 'org.openxmlformats.wordprocessingml.document',
  xls: 'com.microsoft.excel.xls',
  xlsx: 'org.openxmlformats.spreadsheetml.sheet',
  ppt: 'com.microsoft.powerpoint.ppt',
  pptx: 'org.openxmlformats.presentationml.presentation',
  csv: 'public.comma-separated-values-text',
};

DocumentPicker.types = types;

module.exports = DocumentPicker;
module.exports.default = DocumentPicker;
module.exports.types = types;
module.exports.isCancel = DocumentPicker.isCancel;
