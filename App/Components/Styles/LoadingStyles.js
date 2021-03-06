import { StyleSheet } from 'react-native';
import { Colors, Metrics, Type } from '../../Themes';

export const spinnerColor = Colors.teal;

export default StyleSheet.create({
  loadingText: {
    ...Type.default,
    color: Colors.white,
    paddingTop: Metrics.gap(2)
  }
});
