import { TextStyle } from 'react-native';

export function useTextStyles() {
  return {
    default: {
      fontSize: 16,
      lineHeight: 24,
    } as TextStyle,
    defaultSemiBold: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '600',
    } as TextStyle,
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      lineHeight: 32,
    } as TextStyle,
    subtitle: {
      fontSize: 20,
      fontWeight: 'bold',
    } as TextStyle,
    link: {
      fontSize: 16,
      lineHeight: 30,
      color: '#007AFF',
    } as TextStyle,
  };
}
