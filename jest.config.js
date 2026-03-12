module.exports = {
  preset: 'react-native',
  moduleNameMapper: {
    '\\.svg$': '<rootDir>/__mocks__/svg-mock.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-safe-area-context|react-native-svg|react-native-image-picker)/)',
  ],
};
