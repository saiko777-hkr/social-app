import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

const GlassCard = ({ children, style }) => {
  return (
    <View style={[styles.glass, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  glass: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  }
});

export default GlassCard;
