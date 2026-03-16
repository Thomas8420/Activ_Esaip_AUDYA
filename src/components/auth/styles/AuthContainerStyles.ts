import {StyleSheet} from 'react-native';
import {SPACING} from '../../../styles/auth/spacing';

export const authContainerStyles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollView: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING['2xl'],
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  content: {
    flex: 1,
  },
});
