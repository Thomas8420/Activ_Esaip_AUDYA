// Mock de react-native-image-picker pour les tests Jest
module.exports = {
  launchImageLibrary: jest.fn((options, callback) => {
    if (callback) callback({ assets: [] });
    return Promise.resolve({ assets: [] });
  }),
  launchCamera: jest.fn((options, callback) => {
    if (callback) callback({ assets: [] });
    return Promise.resolve({ assets: [] });
  }),
  MediaType: {
    photo: 'photo',
    video: 'video',
    mixed: 'mixed',
  },
};
