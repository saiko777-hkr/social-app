import { Platform } from 'react-native';

export const fonts = {
  regular: Platform.select({
    ios: 'SF Pro Text',
    android: 'Roboto',
    default: 'System'
  }),
  medium: Platform.select({
    ios: 'SF Pro Text Medium',
    android: 'Roboto Medium',
    default: 'System'
  }),
  bold: Platform.select({
    ios: 'SF Pro Display Bold',
    android: 'Roboto Bold',
    default: 'System'
  }),
  light: Platform.select({
    ios: 'SF Pro Text Light',
    android: 'Roboto Light',
    default: 'System'
  })
};

export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32
};

export const fontWeights = {
  regular: '400',
  medium: '500',
  bold: '700',
  light: '300'
};
