module.exports = {
  preset: 'react-native',
  setupFiles: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '\\.svg$': '<rootDir>/__mocks__/svg-mock.js',
    'react-native-document-picker': '<rootDir>/__mocks__/react-native-document-picker.js',
    'react-native-image-picker': '<rootDir>/__mocks__/react-native-image-picker.js',
    'react-native-vector-icons/(.*)': '<rootDir>/__mocks__/react-native-vector-icons.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-safe-area-context|react-native-svg|react-native-image-picker|react-native-document-picker)/)',
  ],
};
