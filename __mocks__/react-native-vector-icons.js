// Mock de react-native-vector-icons pour les tests Jest
// Couvre tous les packages : Ionicons, MaterialIcons, FontAwesome, etc.
const React = require('react');
const { View } = require('react-native');

const Icon = ({ testID, ...props }) =>
  React.createElement(View, { testID, ...props });

module.exports = Icon;
module.exports.default = Icon;
